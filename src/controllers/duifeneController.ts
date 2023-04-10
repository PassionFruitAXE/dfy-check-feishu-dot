import fs from "fs";
import Koa from "koa";
import path from "path";
import { baseResponse } from "../utils/response";
import { check } from "../services/duifene/checkService";
import { getStudentCourse } from "../services/duifene/courseService";
import { login } from "../services/duifene/loginService";
import { TCheckStatus } from "../types/response";

type UserList = {
  nickname: string;
  loginname: string;
  password: string;
};

const storePath = path.join(__dirname, "../../store/username.json");

const getUserList = (): { userList: UserList[] } => {
  return JSON.parse(fs.readFileSync(storePath).toString());
};

const setUserList = (userList: UserList[]) => {
  fs.writeFileSync(storePath, JSON.stringify({ userList }));
};

const handlePromises = (promises: Promise<unknown>[]): Promise<unknown[]> => {
  const ans: unknown[] = [];
  return new Promise((resolve, reject) => {
    try {
      const addTask = (value: unknown) => {
        ans.push(value);
        if (ans.length >= promises.length) {
          resolve(ans);
        }
      };
      promises.forEach(promise => {
        if (promise instanceof Promise) {
          promise.then(
            value => {
              addTask(value);
            },
            reason => {
              addTask(reason);
            },
          );
        } else {
          addTask(promise);
        }
      });
    } catch (error) {
      reject([error]);
    }
  });
};

class duifeneRouterController {
  async check(ctx: Koa.Context): Promise<void> {
    const { checkincode } = ctx.params;
    const { userList } = getUserList();
    const checkStatus = (await handlePromises(
      userList.map(async ({ nickname, loginname, password }) => {
        try {
          const cookie = await login({
            loginname,
            password,
          }).then(response => response.headers["set-cookie"]?.join(";") || "");
          // 所有作业信息
          const { data: courseInfo } = await getStudentCourse(cookie);
          if (!Array.isArray(courseInfo)) {
            throw new Error("可能是账号密码不正确");
          }
          // 将学生id去重
          const TUserId = [
            ...new Set(courseInfo.map(course => course.TUserID)),
          ];
          return await Promise.any(
            TUserId.map(async studentid => {
              try {
                const { data: response } = await check({
                  studentid,
                  checkincode,
                  cookie,
                });
                if (response.msg === -1) {
                  throw new Error(response.msgbox);
                }
                return {
                  nickname,
                  status: response.msgbox,
                };
              } catch (error) {
                return {
                  nickname,
                  status: `${error}`,
                };
              }
            }),
          );
        } catch (error) {
          return {
            nickname,
            status: `签到失败, 错误为${error}`,
          };
        }
      }),
    )) as TCheckStatus[];
    ctx.body = baseResponse({
      data: checkStatus,
    });
  }

  async addUser(ctx: Koa.Context): Promise<void> {
    try {
      const user = ctx.request.body;
      const { userList } = getUserList();
      if (userList.some(item => item.loginname === user.loginname)) {
        throw new Error("账号已经注册过了");
      }
      userList.push(user);
      setUserList(userList);
      ctx.body = baseResponse({ data: userList });
    } catch (error) {
      ctx.body = baseResponse({ code: 401, msg: `${error}` });
    }
  }

  async deleteUser(ctx: Koa.Context): Promise<void> {
    try {
      const { loginname } = ctx.params;
      const { userList } = getUserList();
      const newUserList = userList.filter(item => item.loginname !== loginname);
      setUserList(newUserList);
      ctx.body = baseResponse({ data: newUserList });
    } catch (error) {
      ctx.body = baseResponse({ code: 401, msg: `${error}` });
    }
  }

  async updateUser(ctx: Koa.Context): Promise<void> {
    try {
      const user = ctx.request.body;
      const { userList } = getUserList();
      const newUserList = userList.map(item =>
        item.loginname === user?.loginname ? user : item,
      );
      setUserList(newUserList);
      ctx.body = baseResponse({ data: newUserList });
    } catch (error) {
      ctx.body = baseResponse({ code: 401, msg: `${error}` });
    }
  }

  async getUsers(ctx: Koa.Context): Promise<void> {
    try {
      const { userList } = getUserList();
      ctx.body = baseResponse({ data: userList });
    } catch (error) {
      ctx.body = baseResponse({ code: 401, msg: `${error}` });
    }
  }
}

export default new duifeneRouterController();
