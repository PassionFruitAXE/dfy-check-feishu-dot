export type TBaseResponse<T = null> = {
  code: number;
  msg: string | null;
  data: T;
};

export type TCourseInfo = {
  BackgroundColor: string;
  ClassName: string;
  Color: string;
  CourseID: string;
  CourseName: string;
  CreaterDate: string;
  CreaterID: string;
  IsCanel: string;
  Status: string;
  TClassID: string;
  TUserID: string;
  TermId: string;
  TermName: string;
}[];

export type TCheckStatus = {
  nickname: string;
  status: string;
};

export type TAccessToken = {
  app_access_token: string;
  code: number;
  expire: number;
  msg: string;
  tenant_access_token: string;
};

export type BotReply = {
  body: {
    content: string;
  };
  chat_id: string;
  create_time: string;
  deleted: boolean;
  message_id: string;
  msg_type: string;
  parent_id: string;
  root_id: string;
  sender: {
    id: string;
    id_type: string;
    sender_type: string;
    tenant_key: string;
  };
  update_time: string;
  updated: boolean;
};
