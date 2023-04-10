import axios from "axios";
import { app_id, app_secret, FEISHU_OPEN_PREFIX } from "../../config";
import { BotReply, TAccessToken, TBaseResponse } from "../../types/response";

export function getAccessToken() {
  const requestBody = { app_id, app_secret };
  return axios.post<TAccessToken>(
    `${FEISHU_OPEN_PREFIX}/auth/v3/app_access_token/internal`,
    requestBody,
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
}

type TReplyProps = {
  Authorization: string;
  message_id: string;
  requestBody: {
    content: string;
    msg_type: string;
    uuid: string;
  };
};

export function reply({ Authorization, message_id, requestBody }: TReplyProps) {
  console.log(requestBody);
  return axios.post<TBaseResponse<BotReply>>(
    `${FEISHU_OPEN_PREFIX}/im/v1/messages/${message_id}/reply`,
    requestBody,
    {
      headers: {
        Authorization,
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
}
