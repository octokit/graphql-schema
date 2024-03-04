#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GITHUB_TOKEN) {
  console.log("GITHUB_TOKEN not set");
  process.exit(1);
}

import { execa } from "execa";
import { request as octokitRequest } from "@octokit/request";
const request = octokitRequest.defaults({
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
