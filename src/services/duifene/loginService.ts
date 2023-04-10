import axios from "axios";

export function login(user: { loginname: string; password: string }) {
  return axios.post(
    "https://www.duifene.com/AppCode/LoginInfo.ashx",
    { ...user, action: "login" },
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        referer: "https://www.duifene.com/Home.aspx",
      },
    },
  );
}
