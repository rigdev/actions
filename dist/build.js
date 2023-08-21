import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { makeClient } from "./lib.js";
function getBuildID(inputs) {
    if (inputs.buildID !== undefined && inputs.buildID != "") {
        return inputs.buildID;
    }
    return context.sha.substring(0, 10);
}
async function action(inputs) {
    const client = await makeClient();
    const buildID = getBuildID(inputs);
    await client.capsule.createBuild({
        buildId: buildID,
        image: inputs.image,
        capsuleId: inputs.capsuleID,
    });
    setOutput("buildID", buildID);
}
try {
    action({
        image: getInput("image"),
        capsuleID: getInput("capsuleID"),
        buildID: getInput("buildID"),
    });
}
catch (e) {
    setFailed(e.message);
}
