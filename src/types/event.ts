export type FeiShuBotBody = {
  challenge: string;
  schema: string;
  header: {
    event_id: string;
    token: string;
    create_time: string;
    event_type: string;
    tenant_key: string;
    app_id: string;
  };
  event: {
    sender: {
      sender_id: {
        union_id: string;
        user_id: string;
        open_id: string;
      };
      sender_type: string;
      tenant_key: string;
    };
    message: {
      message_id: string;
      root_id: string;
      parent_id: string;
      create_time: string;
      chat_id: string;
      chat_type: string;
      message_type: string;
      content: string;
      mentions: [
        {
          key: string;
          id: {
            union_id: string;
            user_id: string;
            open_id: string;
          };
          name: string;
          tenant_key: string;
        },
      ];
    };
  };
};
