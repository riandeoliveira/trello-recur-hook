import { Card } from "./card";
import { Label } from "./label";
import { List } from "./list";
import { Webhook } from "./webhook";

export class Trello {
  public readonly cards = new Card();
  public readonly labels = new Label();
  public readonly lists = new List();
  public readonly webhook = new Webhook();
}
