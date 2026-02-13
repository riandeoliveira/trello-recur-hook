import { Trello } from "@/trello";

const trello = new Trello();

(async () => {
  try {
    const webhooks = await trello.webhook.getAll();

    for (const webhook of webhooks) {
      await trello.webhook.delete(webhook.id);
    }

    await trello.webhook.create();
  } catch (error) {
    console.log("Error running webhook:", error);

    process.exit(1);
  }
})();
