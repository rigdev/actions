import { Client } from "@rigdev/sdk/lib/index.js";
import { getInput } from "@actions/core";
import {load} from "js-yaml";

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

export function parseDeployOutput(config: {[key: string]: string}): {[key: string]: any} {
  let output: {[key: string]: any} = {};
  for (let k in config) {
    let obj = load(config[k]);
    output[k] = obj;
   }
  return output;
}

export function getBool(name: string): boolean {
   return getInput(name) === "true";
}
