import Koa from "koa";
import { baseResponse } from "../utils/response";
import { bot, duifene } from "../api";
import { checkStatusCard } from "../template/card";
import { FeiShuBotBody } from "./../types/event";

enum EventType {
  IM_MESSAGE_RECEIVE = "im.message.receive_v1",
}

const handleEvent = {
  [EventType.IM_MESSAGE_RECEIVE]: async (event: FeiShuBotBody["event"]) => {
    const {
      message: { content, message_id },
    } = event;
    const [, checkincode] = JSON.parse(content)?.text?.split(" ");
    const tokenResponse = await bot.getAccessToken();
    const Authorization = `Bearer ${tokenResponse?.data.app_access_token}`;
    duifene
      .check(checkincode)
      .then(value => {
        const requestBody = checkStatusCard(
          value?.data?.data || [],
          message_id,
        );
        bot.reply({
          Authorization,
          message_id,
          requestBody,
        });
      })
      .catch(error => {
        bot.reply({
          Authorization,
          message_id,
          requestBody: {
            content: `{"text":"签到失败: ${error}"}`,
            msg_type: "text",
            uuid: message_id,
          },
        });
      });
  },
};

class verificationRouterController {
  async verification(ctx: Koa.Context): Promise<void> {
    const feiShuBotBody = ctx.request.body as FeiShuBotBody;
    const {
      header: { event_type: eventType },
      event,
    } = feiShuBotBody;
    handleEvent[eventType as EventType] &&
      (await handleEvent[eventType as EventType](event));
    ctx.body = {
      ...JSON.parse(baseResponse()),
      challenge: feiShuBotBody.challenge,
    };
  }
}

export default new verificationRouterController();
