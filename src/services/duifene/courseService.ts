import axios from "axios";
import { TCourseInfo } from "../../types/response";

export function getStudentCourse(cookie: string) {
  const data = {
    action: "getstudentcourse",
    classtypeid: "2",
    iscanel: 0,
  };
  return axios.post<TCourseInfo>(
    "https://www.duifene.com/_UserCenter/CourseInfo.ashx",
    data,
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie,
      },
    },
  );
}
