const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();
const { fileLoader, mergeResolvers, mergeTypes } = require('merge-graphql-schemas');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');

const models = require('./models');
const authMiddleware = require('./middlewares/auth.middleware');

const SECRET = 'wqj6d1y03n-d9m13d0123i0dd';
const SECRET2 = 'ij523-e12k70506kh0kkg421';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const app = express();
app.use(cors());
app.use(authMiddleware(models, SECRET, SECRET2));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    }
    return {
      user: req.user,
      models,
      SECRET,
      SECRET2,
    };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
    });
  } catch (e) {
    console.log('Server ERROR!', e.message);
    process.exit(1);
  }
};

start();
