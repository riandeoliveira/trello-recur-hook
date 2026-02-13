import type { FastifyRequest } from "fastify";

export type TrelloWebhookRequest = FastifyRequest<{
  Body: {
    action: {
      type: string;
      data: {
        card: {
          id: string;
        };
      };
    };
  };
}>;
