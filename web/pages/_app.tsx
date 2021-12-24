import { createClient, Provider } from 'urql';
import '../styles/globals.css';

const urqlClient = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  }
})

function Greddit({Component, pageProps}) {
  return (
    <Provider value={urqlClient}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default Greddit;
