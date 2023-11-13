import { getInput, setFailed, setOutput } from "@actions/core";
import { getBool, makeClient, parseDeployOutput } from "./lib.js";

interface Inputs {
  project: string;
  image: string;
  capsule: string;
  skipImageCheck: boolean;
  deploy: boolean;
  environment: string;
  dryRun: boolean;
  force: boolean;
}

async function action(inputs: Inputs) {
  if (inputs.deploy && inputs.environment == "") {
    throw new Error("deploy was true, but environment not given.");
  }
  const client = await makeClient();
  let response = await client.build.create({
    skipImageCheck: inputs.skipImageCheck,
    image: inputs.image,
    capsuleId: inputs.capsule,
    projectId: inputs.project,
  });
  setOutput("build", response.buildId);

  if (inputs.deploy) {
    let resp = await client.capsule.deploy({
      projectId: inputs.project,
      environmentId: inputs.environment,
      capsuleId: inputs.capsule,
      dryRun: inputs.dryRun,
      force: inputs.force,
      changes: [
        {
          field: {
            case: "buildId",
            value: response.buildId,
          },
        },
      ],
    });
    let output = parseDeployOutput(resp.resourceYaml);
    setOutput("rolloutConfig", output);
  }
}

try {
  action({
    project: getInput("project"),
    image: getInput("image"),
    capsule: getInput("capsule"),
    environment: getInput("environment"),
    skipImageCheck: getInput("skipImageCheck") === "true" ? true : false,
    deploy: getBool("deploy"),
    dryRun: getBool("dryRun"),
    force: getBool("force"),
  });
} catch (e: any) {
  setFailed(e.message);
}
