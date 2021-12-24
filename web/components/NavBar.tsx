import React from 'react';
import Link from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface OwnProps {
}

type Props = OwnProps;

const NavBar: React.FC<Props> = (props) => {
  const [{data, fetching}] = useMeQuery();
  let navBody = null

  if (fetching) {
    navBody = <span className={'text-white'}>Loading...</span>
  } else if (data?.me) {
    navBody = (
      <>
        <span className={'text-white pr-4'}>Hi, {data.me.username}</span>
        <button className={'text-white hover:underline'}>Logout</button>
      </>
    )
  } else {
    navBody = (
      <>
        <Link href={'/login'}><a className={'py-2 px-4 hover:underline text-white'}>Login</a></Link>
        <Link href={'/register'}><a className={'py-2 px-4 hover:underline text-white'}>Register</a></Link>
      </>
    )
  }
  return (
    <header className={'sticky flex top-0 w-full bg-emerald-600 py-3 px-6'}>
      <nav className={'ml-auto'}>
        {navBody}
      </nav>
    </header>
  );
};

export default NavBar;
