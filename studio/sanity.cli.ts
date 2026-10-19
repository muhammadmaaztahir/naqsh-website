import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "naqsh-admin", // → https://naqsh-admin.sanity.studio (change if taken)
  deployment: { appId: "l0tgjsowwo75kroel33eltuc" },
});
