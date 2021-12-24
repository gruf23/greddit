import styles from '../styles/Home.module.css';
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import { NextUrqlClientConfig, withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{data}] = usePostsQuery()
  return (
    <>
      <NavBar/>
      <main className={'text-3xl font-bold underline'}>
        <h1 className={styles.title}>
          Hello world!
        </h1>
        {data ? data.posts.map((p) => (
          <div key={p.id}>
            <h3>{p.title}</h3>
          </div>
        )) : null}
      </main>
    </>
  );
};
export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {ssr: true})(Index);
