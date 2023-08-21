import { getInput, setFailed } from "@actions/core";
import { makeClient } from "./lib.js";

interface Inputs {
  capsuleID: string;
  buildID: string;
}

async function action(inputs: Inputs) {
  const client = await makeClient();
  await client.capsule.deploy({
    capsuleId: inputs.capsuleID,
    changes: [
      {
        field: {
          case: "buildId",
          value: inputs.buildID,
        },
      },
    ],
  });
}

try {
  action({
    capsuleID: getInput("capsuleID"),
    buildID: getInput("buildID"),
  });
} catch (e: any) {
  setFailed(e.message);
}
