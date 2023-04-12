import { TAlertProps, TReplyProps } from "../api/bot";
import { TCheckStatus } from "../types/response";

export function createReplyCheckStatusCard(
  statusList: TCheckStatus[],
): TReplyProps["requestBody"] {
  const template = {
    config: { wide_screen_mode: true },
    elements: statusList.map(({ nickname, status }) => ({
      tag: "markdown",
      content: `${nickname} ${status}\n`,
    })),
    header: {
      template: "blue",
      title: { content: "签到状态", tag: "plain_text" },
    },
  };
  return {
    content: JSON.stringify(template),
    msg_type: "interactive",
    uuid: `${+new Date()}`,
  };
}

type CreateErrorCardProps = {
  title: string;
  content: string;
  receive_id?: string;
};

export function createErrorCard({
  title,
  content,
  receive_id = "",
}: CreateErrorCardProps): TAlertProps["requestBody"] {
  const template = {
    config: { wide_screen_mode: true },
    elements: [
      {
        tag: "div",
        text: {
          content: `${content}`,
          tag: "plain_text",
        },
      },
    ],
    header: {
      template: "red",
      title: {
        content: `${title}`,
        tag: "plain_text",
      },
    },
  };
  return {
    content: JSON.stringify(template),
    msg_type: "interactive",
    receive_id,
    uuid: `${+new Date()}`,
  };
}
