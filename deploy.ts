import { getInput, setFailed } from "@actions/core";
import { makeClient } from "./lib.js";

interface Inputs {
  capsule: string;
  build: string;
}

async function action(inputs: Inputs) {
  const client = await makeClient();
  await client.capsule.deploy({
    capsuleId: inputs.capsule,
    changes: [
      {
        field: {
          case: "buildId",
          value: inputs.build,
        },
      },
    ],
  });
}

try {
  action({
    capsule: getInput("capsule"),
    build: getInput("build"),
  });
} catch (e: any) {
  setFailed(e.message);
}
