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
const nodemailer = require('nodemailer');

const { refreshTokens } = require('./helpers/auth');
const models = require('./models');
const authMiddleware = require('./middlewares/auth.middleware');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.ADMIN_GMAIL_USER,
    pass: process.env.ADMIN_GMAIL_PASS,
  },
});

const {
  SECRET, SECRET2, EMAIL_SECRET, ADMIN_GMAIL_USER: ADMIN_EMAIL
} = process.env;

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const app = express();
app.use(cors(), bodyParser.json(), authMiddleware(models, SECRET, SECRET2));

app.get('/confirmation/:token', async (req, res) => {
  try {
    const {
      user: { id },
    } = jwt.verify(req.params.token, EMAIL_SECRET);
    await models.User.findByIdAndUpdate(id, { confirmed: true });
  } catch (e) {
    res.send('Error');
  }

  if (process.env.NODE_ENV === 'production') {
    return res.redirect(`${req.protocol}://${req.get('host')}`);
  }

  return res.redirect('http://localhost:3000');
});

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
      URL: `${req.protocol}://${req.get('host')}`,
      user: req.user,
      models,
      SECRET,
      SECRET2,
      EMAIL_SECRET,
      transporter,
      ADMIN_EMAIL,
    };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '../client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

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
