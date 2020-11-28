const execa = require("execa");

console.log("⌛  Generating schema.d.ts …");

execa("npx", ["graphql-codegen"]);
