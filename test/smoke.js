import { strict } from "assert";

import { validate, schema } from "../index.js";

strict.equal(typeof validate, "function");
strict.equal(typeof schema.json, "object");
strict.equal(typeof schema.idl, "string");
