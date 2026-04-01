import dayjs from "dayjs";
import cron from "node-cron";
import { Trello } from "./trello";

const trello = new Trello();

export const startCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Starting daily cron job to sort RECORRENTES list...");

    try {
      const lists = await trello.lists.getAll();

      const recurList = lists.find((list) =>
        list.name.toUpperCase().includes("RECORRENTES"),
      );

      if (!recurList) {
        console.warn(
          "List with 'RECORRENTES' not found. Skipping sorting job.",
        );

        return;
      }

      console.log(`Found list: ${recurList.name}. Fetching cards...`);

      const cards = await trello.lists.getCards(recurList.id);

      const sortedCards = [...cards].sort((a, b) => {
        const aDueStr = a.due;
        const bDueStr = b.due;

        const aHasDue = !!aDueStr;
        const bHasDue = !!bDueStr;

        if (!aHasDue && !bHasDue) return 0;
        if (!aHasDue) return 1;
        if (!bHasDue) return -1;

        const aDate = dayjs(aDueStr);
        const bDate = dayjs(bDueStr);

        return aDate.valueOf() - bDate.valueOf();
      });

      console.log(`Sorting ${sortedCards.length} cards in Trello...`);

      for (const card of sortedCards) {
        await trello.cards.update(card.id, {
          pos: "bottom",
        });
      }

      console.log("Successfully sorted RECORRENTES list.");
    } catch (error) {
      console.error("Error running sort recurring job:", error);
    }
  });
};
