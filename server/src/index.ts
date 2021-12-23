import { MikroORM } from '@mikro-orm/core';
import mikroConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { __prod__ } from './constants';
import { MyContext } from './types';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";


declare module "express-session" {
  interface Session {
    userId: number;
  }
}

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  const sessionMiddleware = session({
    name: 'qid',
    store: new RedisStore({
      client: redisClient, //
      disableTouch: true,
      disableTTL: true,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: __prod__ // https only
    },
    saveUninitialized: false,
    secret: 'rendomstringyo',
    resave: false,
  });

  app.use(sessionMiddleware);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(), // need this to get old playground which is okay w/ cookies
    ],
    context: ({req, res}): MyContext => ({
      em: orm.em,
      req,
      res
    })
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({app});

  app.listen(4000, () => {
    console.log('Server started on localhost:4000');
  });
};

main().catch(err => {
  console.error(err);
});
