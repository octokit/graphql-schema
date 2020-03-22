#!/usr/bin/env node

const writeFileSync = require("fs").writeFileSync;

require("dotenv").config();

if (!process.env.GITHUB_TOKEN) {
  console.log("GITHUB_TOKEN not set");
  process.exit(1);
}

const execa = require("execa");
const request = require("@octokit/request").request.defaults({
  headers: {
    authorization: `bearer ${process.env.GITHUB_TOKEN}`,
  },
});

console.log("⌛  Loading GitHub GraphQL JSON schema …");
request("/graphql")
  .then((response) => {
    writeFileSync("schema.json", JSON.stringify(response.data.data, null, 2));

    console.log("⌛  Loading GitHub GraphQL IDL schema …");
    return request("/graphql", {
      headers: {
        accept: "application/vnd.github.v4.idl",
      },
    });
  })

  .then(async (response) => {
    writeFileSync("schema.graphql", response.data.data);

    const { stdout } = await execa("git", ["status", "schema.graphql"]);
    if (/nothing to commit/.test(stdout)) {
      console.log("✅  Schema is up-to-date");
      return;
    }

    console.log("📼  New schema recorded");
  });
