const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
require("dotenv").config();
const { fileLoader, mergeResolvers, mergeTypes } = require("merge-graphql-schemas");
const path = require("path");

const models = require("./models");
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schemas")));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, "./resolvers")));

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models }
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    app.listen(PORT, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    );
  } catch (e) {
    console.log("Server ERROR!", e.message);
    process.exit(1);
  }
};

start();
