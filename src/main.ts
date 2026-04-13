import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { DB } from "./db/db";
import { Query } from "./Query";
import { Cv } from "./Cv";
import { Mutation } from "./Mutation";
import { Subscription } from "./Subscription";

export type MyContext = {
  DB: typeof DB;
};

export const schema = createSchema<MyContext>({
  typeDefs: fs.readFileSync(
    path.join(__dirname, "./../schema/schema.graphql"),
    "utf-8",
  ),
  resolvers: {
    Query,
    Cv,
    Mutation,
    Subscription,
  },
});

function main() {
  const yoga = createYoga<MyContext>({
    schema,
    context: () => ({ DB }),
  });

  const server = createServer(yoga);
  server.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
  });
}

main();
