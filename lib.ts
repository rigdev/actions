import { Client } from "@rigdev/sdk/lib/index.js";
import { getInput } from "@actions/core";

export interface LoginInput {
  clientID: string;
  clientSecret: string;
  url: string;
}

export async function makeClient(): Promise<Client> {
  const input = {
    clientID: getInput("clientID"),
    clientSecret: getInput("clientSecret"),
    url: getInput("url"),
  };
  const client = new Client({
    host: input.url,
    credentials: {
      id: input.clientID,
      secret: input.clientSecret,
    },
  });
  return client;
}
