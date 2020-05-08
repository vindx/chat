const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();
const { fileLoader, mergeResolvers, mergeTypes } = require('merge-graphql-schemas');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const { refreshTokens } = require('./helpers/auth');
const models = require('./models');
const authMiddleware = require('./middlewares/auth.middleware');

const { SECRET, SECRET2 } = process.env;

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const app = express();
app.use(cors(), bodyParser.json(), authMiddleware(models, SECRET, SECRET2));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: async ({ 'auth-token': token, 'auth-refresh-token': refreshToken }) => {
      if (token && refreshToken) {
        try {
          const { user } = jwt.verify(token, SECRET);
          return { user };
        } catch (err) {
          const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
          return { user: newTokens.user };
        }
      }
      return {};
    },
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return { ...connection.context, models };
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
      useFindAndModify: false,
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
