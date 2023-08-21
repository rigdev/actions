import { getInput, setFailed } from "@actions/core";
import { makeClient } from "./lib.js";
async function action(inputs) {
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
}
catch (e) {
    setFailed(e.message);
}
