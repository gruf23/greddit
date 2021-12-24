import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { cacheExchange, QueryInput, Cache, query } from '@urql/exchange-graphcache';
import '../styles/globals.css';
import { MeDocument } from '../generated/graphql';

function betterUpdateQuery<Result, Query> (
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result as Result, data as any) as any)
}

const urqlClient = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
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
                return query
              } else {
                return {
                  me: result.login.user,
                }
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
                return query
              } else {
                return {
                  me: result.register.user,
                }
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
          )
        }
      }
    }
  }), fetchExchange]
});

function Greddit({Component, pageProps}) {
  return (
    <Provider value={urqlClient}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default Greddit;
