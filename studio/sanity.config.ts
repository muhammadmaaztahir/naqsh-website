import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID as string;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "naqsh",
  title: "Naqsh Shop Admin",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Shop")
          .items([
            S.documentTypeListItem("product").title("Products"),
            S.divider(),
            S.documentTypeListItem("brand").title("Brands"),
            S.documentTypeListItem("category").title("Categories"),
            S.documentTypeListItem("fabric").title("Fabrics"),
            S.documentTypeListItem("color").title("Colors"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
