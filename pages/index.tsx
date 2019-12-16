import Head from 'next/head';
import { Typography } from '@material-ui/core';
import Page from '../components/Page';

const Home = () => (
  <Page>
    <Head>
      <title>Video Player with XState</title>
    </Head>
    <Typography variant="h1">Video Player with XState</Typography>
  </Page>
);

export default Home;
