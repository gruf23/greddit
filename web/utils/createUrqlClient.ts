import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { MeDocument } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any): object => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          betterUpdateQuery(
            cache,
            {query: MeDocument},
            _result,
            (result: any, query) => {
              if (result.login.errors) {
                return query;
              } else {
                return {
                  me: result.login.user,
                };
              }
            }
          );
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery(
            cache,
            {query: MeDocument},
            _result,
            (result: any, query) => {
              if (result.register.errors) {
                return query;
              } else {
                return {
                  me: result.register.user,
                };
              }
            }
          );
        },
        logout: (_result, args, cache, info) => {
          betterUpdateQuery(
            cache,
            {query: MeDocument},
            _result,
            (query, data) => ({me: null})
          );
        }
      }
    }
  }), ssrExchange, fetchExchange]
});
