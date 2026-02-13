import fastify from "fastify";
import { Trello } from "./trello";
import type { TrelloWebhookRequest } from "./types/webhook";
import { RecurrenceUtil } from "./utils/recurrence-util";

const trello = new Trello();
const app = fastify({ logger: true });

app.post("/api/webhook/trello", async (req: TrelloWebhookRequest, reply) => {
  const action = req.body.action;
  const cardId = action.data.card.id;

  if (!action.data || action.type !== "updateCard") {
    return reply.code(200).send();
  }

  const lists = await trello.lists.getAll();
  const labels = await trello.labels.getAll();
  const card = await trello.cards.get(cardId);

  const doneList = lists.find((item) => item.name === "FEITO");
  const recurringLabel = labels.find((item) => item.name === "RECORRENTE");

  if (!doneList) throw new Error("List not found: FEITO");
  if (!recurringLabel) throw new Error("Label not found: RECORRENTE");

  // If the card is outside the "FEITO" list, does not have a "RECORRENTE" label, and is completed, move it there
  if (
    card.idList !== doneList.id &&
    !card.idLabels.includes(recurringLabel.id) &&
    card.dueComplete
  ) {
    await trello.cards.update(card.id, {
      idList: doneList.id,
      pos: "top",
    });
  }

  // If the card has a "RECORRENTE" label and is completed, apply the recurrence rule
  if (card.idLabels.includes(recurringLabel.id) && card.dueComplete) {
    const recurrenceRule = RecurrenceUtil.parse(card.desc);

    if (recurrenceRule) {
      await trello.cards.update(card.id, {
        due: RecurrenceUtil.nextDue(card.due, recurrenceRule) ?? "",
        dueComplete: false,
      });
    }
  }

  return reply.code(200).send();
});

// Endpoint to verify webhook URL (Trello requires a 200 response)
app.head("/api/webhook/trello", (_, reply) => {
  return reply.code(200).send();
});

const port = Number(process.env.PORT) || 3000;

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => console.log("🚀 Server running"))
  .catch(console.error);
