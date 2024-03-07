import { run as runSetup } from "./actions/setup";
// import { run as runDeploy } from "./actions/setup";
// import { run as registerImage } from "./actions/setup";

export enum Command {
  Setup,
  // Deploy,
  // RegisterImage,
}

export async function run(command: Command): Promise<void> {
  switch (command) {
    case Command.Setup:
      return await runSetup();
    // case Command.Deploy:
    //   return await runDeploy();
    // case Command.RegisterImage:
    //   return await registerImage();
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}
