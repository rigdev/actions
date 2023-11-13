import { getInput, setFailed, setOutput } from "@actions/core";

import { makeClient } from "./lib.js";

interface Inputs {
  image: string;
  capsule: string;
  skipImageCheck: boolean;
  deploy: boolean;
}

async function action(inputs: Inputs) {
  const client = await makeClient();
  let response = await client.build.createBuild({
    skipImageCheck: inputs.skipImageCheck,
    image: inputs.image,
    capsuleId: inputs.capsule,
  });
  setOutput("build", response.buildId);

  if (inputs.deploy) {
    await client.capsule.deploy({
      capsuleId: inputs.capsule,
      changes: [
        {
          field: {
            case: "buildId",
            value: response.buildId,
          },
        },
      ],
    });
  }
}

try {
  action({
    image: getInput("image"),
    capsule: getInput("capsule"),
    skipImageCheck: getInput("skipImageCheck") == "true" ? true : false,
    deploy: getInput("deploy") == "true" ? true : false,
  });
} catch (e: any) {
  setFailed(e.message);
}
