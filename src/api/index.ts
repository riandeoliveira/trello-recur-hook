import axios from "axios";
import { envVars } from "@/constants/env-vars";

export const api = axios.create({
  baseURL: "https://api.trello.com/1",
});

export const authParams = {
  key: envVars.API_KEY,
  token: envVars.APP_TOKEN,
};
