import { Client } from "@rig/sdk/lib/index.js";
import { getInput } from "@actions/core";
export async function makeClient() {
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
