import { ReactNode } from 'react';
import Head from 'next/head';

interface PageProps {
  children: ReactNode,
};

const Page = ({ children }: PageProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    </Head>
    {children}
  </>
);

export default Page;
