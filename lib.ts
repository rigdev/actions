import { Client } from "@rigdev/sdk/lib/index.js";
import { getInput } from "@actions/core";

export interface LoginInput {
  clientID: string;
  clientSecret: string;
  project: string;
  url: string;
}

export async function makeClient(): Promise<Client> {
  const input = {
    url: getInput("url"),
    project: getInput("project"),
    clientID: getInput("clientID"),
    clientSecret: getInput("clientSecret"),
  };
  const client = new Client({
    host: input.url,
    projectID: input.project,
    credentials: {
      id: input.clientID,
      secret: input.clientSecret,
    },
  });
  return client;
}
