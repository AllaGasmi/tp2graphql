import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "http";
import { DB } from "./db/db";
import { Query } from "./Query";
import { Cv } from "./Cv";

const fs = require("fs");
const path = require("path");

type MyContext = {
  DB: typeof DB;
};

export const schema = createSchema<MyContext>({
  typeDefs: fs.readFileSync(
    path.join(__dirname, "./../schema/schema.graphql"),
    "utf-8",
  ),
    resolvers: {
        Query,
        Cv
  }
  ,
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
