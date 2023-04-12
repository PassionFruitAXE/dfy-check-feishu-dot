import Koa from "koa";
import { baseResponse } from "../utils/response";
import { bot, duifene } from "../api";
import { createReplyCheckStatusCard, createErrorCard } from "../template/card";
import { FeiShuBotBody } from "./../types/event";

enum EventType {
  IM_MESSAGE_RECEIVE = "im.message.receive_v1",
}

const handleEvent = {
  [EventType.IM_MESSAGE_RECEIVE]: async (event: FeiShuBotBody["event"]) => {
    /**@ 机器人事件 */
    const {
      message: { content, message_id },
    } = event;
    const [, sendContent] = JSON.parse(content)?.text?.split(" ") as string[];
    /**指令类型 */
    const contentType = {
      /**签到码 */
      checkInCode: /^[0-9]{4}$/,
    };
    const Authorization = await bot.getToken();
    if (contentType.checkInCode.test(sendContent)) {
      /**输入为验证码 */
      try {
        const response = await duifene.check(sendContent);
        bot.reply({
          Authorization,
          message_id,
          requestBody: createReplyCheckStatusCard(response?.data?.data || []),
        });
      } catch (error) {
        bot.reply({
          Authorization,
          message_id,
          requestBody: createErrorCard({
            title: "签到失败",
            content: `${error}`,
          }),
        });
      }
    } else {
      throw new Error("旅行者, 我听不懂你在说什么");
    }
  },
};

class verificationRouterController {
  async verification(ctx: Koa.Context): Promise<void> {
    const feiShuBotBody = ctx.request.body as FeiShuBotBody;
    const {
      header: { event_type: eventType },
      event,
    } = feiShuBotBody;
    try {
      handleEvent[eventType as EventType] &&
        (await handleEvent[eventType as EventType](event));
    } catch (error) {
      const Authorization = await bot.getToken();
      const receive_id = event.message.chat_id;
      bot.alert({
        Authorization,
        requestBody: createErrorCard({
          title: "出现错误",
          content: `${error}`,
          receive_id,
        }),
      });
    }
    ctx.body = {
      ...JSON.parse(baseResponse()),
      challenge: feiShuBotBody.challenge,
    };
  }
}

export default new verificationRouterController();
