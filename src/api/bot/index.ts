import axios from "axios";
import { app_id, app_secret, FEISHU_OPEN_PREFIX } from "../../config";
import { BotReply, TAccessToken, TBaseResponse } from "../../types/response";

const request = axios.create({
  headers: { "Content-Type": "application/json; charset=utf-8" },
});

function getAccessToken() {
  const requestBody = { app_id, app_secret };
  return request.post<TAccessToken>(
    `${FEISHU_OPEN_PREFIX}/auth/v3/app_access_token/internal`,
    requestBody,
  );
}

export const getToken = async () => {
  const tokenResponse = await getAccessToken();
  return `Bearer ${tokenResponse?.data.app_access_token}`;
};

export type TReplyProps = {
  Authorization: string;
  message_id: string;
  requestBody: {
    content: string;
    msg_type: string;
    uuid: string;
  };
};

export function reply({ Authorization, message_id, requestBody }: TReplyProps) {
  return request.post<TBaseResponse<BotReply>>(
    `${FEISHU_OPEN_PREFIX}/im/v1/messages/${message_id}/reply`,
    requestBody,
    {
      headers: {
        Authorization,
      },
    },
  );
}

export type TAlertProps = {
  Authorization: string;
  requestBody: {
    receive_id: string;
    msg_type: string;
    content: string;
    uuid: string;
  };
};

export function alert({ Authorization, requestBody }: TAlertProps) {
  return request.post(
    `${FEISHU_OPEN_PREFIX}/im/v1/messages?receive_id_type=chat_id`,
    requestBody,
    {
      headers: {
        Authorization,
      },
    },
  );
}
