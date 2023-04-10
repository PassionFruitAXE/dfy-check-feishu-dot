import { TCheckStatus } from "../types/response";

export function checkStatusCard(
  statusList: TCheckStatus[],
  message_id: string,
) {
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
    uuid: message_id,
  };
}
