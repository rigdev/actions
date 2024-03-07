import { getInput, info } from "@actions/core";

interface Inputs {
  version: string;
}

export async function run(): Promise<void> {
  const inputs: Inputs = {
    version: getInput("version"),
  };

  info("version: " + inputs.version);
}
