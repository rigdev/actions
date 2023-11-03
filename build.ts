import { getInput, setOutput, setFailed } from "@actions/core";
import { makeClient } from "./lib.js";

interface Inputs {
  image: string;
  capsule: string;
  skipImageCheck: boolean;
}

async function action(inputs: Inputs) {
  const client = await makeClient();
  let response = await client.build.createBuild({
    skipImageCheck: inputs.skipImageCheck,
    image: inputs.image,
    capsuleId: inputs.capsule,
  });
  setOutput("build", response.buildId);
}

try {
  action({
    image: getInput("image"),
    capsule: getInput("capsule"),
    skipImageCheck: getInput("skipImageCheck") == "true" ? true : false,
  });
} catch (e: any) {
  setFailed(e.message);
}
