import styles from '../styles/Home.module.css'
import NavBar from '../components/NavBar';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className={'text-3xl font-bold underline'}>
        <h1 className={styles.title}>
          Hello world!
        </h1>
      </main>
    </>
  )
}
