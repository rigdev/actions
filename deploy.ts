import { getInput, setFailed, setOutput } from "@actions/core";
import { getBool, makeClient, parseDeployOutput } from "./lib.js";

interface Inputs {
  project: string;
  environment: string;
  capsule: string;
  build: string;
  dryRun: boolean;
  force: boolean;
}

async function action(inputs: Inputs) {
  const client = await makeClient();
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
          value: inputs.build,
        },
      },
    ],
  });
  let output = parseDeployOutput(resp.resourceYaml);
  setOutput("rolloutConfig", output);
}

try {
  action({
    project: getInput("project"),
    environment: getInput("environment"),
    capsule: getInput("capsule"),
    build: getInput("build"),
    dryRun: getBool("dryRun"),
    force: getBool("force"),
  });
} catch (e: any) {
  setFailed(e.message);
}
