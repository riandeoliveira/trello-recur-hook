import { api, authParams } from "@/api";
import { envVars } from "@/constants/env-vars";

export class Webhook {
  public async create(): Promise<void> {
    await api.post("/webhooks", null, {
      params: {
        description: "trello-bot",
        callbackURL: envVars.WEBHOOK_URL,
        idModel: envVars.BOARD_ID,
        ...authParams,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await api.delete(`/webhooks/${id}`, {
      params: {
        ...authParams,
      },
    });
  }

  public async getAll(): Promise<GetAllResponse> {
    const response = await api.get(`/tokens/${envVars.APP_TOKEN}/webhooks`, {
      params: {
        ...authParams,
      },
    });

    return response.data;
  }
}

interface IWebhook {
  id: string;
}

interface GetAllResponse extends Array<IWebhook> {}
