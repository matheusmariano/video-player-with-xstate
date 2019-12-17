import Head from 'next/head';
import Page from '../components/Page';
import VideoPlayer from '../components/VideoPlayer';
import { Container, Grid } from '@material-ui/core';

const Home = () => (
  <Page>
    <Head>
      <title>Video Player with XState</title>
    </Head>
    <Container>
      <Grid container>
        <Grid item>
          <VideoPlayer
            sources={[
              {
                src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                type: 'video/mp4',
              },
            ]}
            videoProps={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    </Container>
  </Page>
);

export default Home;
