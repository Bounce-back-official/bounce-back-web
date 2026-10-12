import type { SchemaTypeDefinition } from "sanity";

import { articleType } from "./articleType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";

export const schemaTypes: SchemaTypeDefinition[] = [
  productType,
  categoryType,
  articleType,
];
