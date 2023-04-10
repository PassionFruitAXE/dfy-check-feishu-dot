import axios from "axios";

type TProps = {
  studentid: string;
  checkincode: string;
  cookie: string;
};

export function check({ studentid, checkincode, cookie }: TProps) {
  return axios.post<{ msg: number; msgbox: string }>(
    "https://www.duifene.com/_CheckIn/CheckIn.ashx",
    {
      action: "studentcheckin",
      studentid,
      checkincode,
    },
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: cookie,
      },
    },
  );
}
