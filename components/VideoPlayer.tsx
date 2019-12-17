import { SourceHTMLAttributes, VideoHTMLAttributes, useRef } from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { Card, CardMedia, CardActions, IconButton, Slider, Grid, Box, Typography } from '@material-ui/core';
import { PlayArrow, Pause, Replay } from '@material-ui/icons';

interface VideoPlayerProps {
  sources: SourceHTMLAttributes<HTMLSourceElement>[],
  videoProps?: VideoHTMLAttributes<HTMLVideoElement>,
};

const videoMachine = Machine({
  id: 'video',
  initial: 'loading',
  context: {
    video: null,
    elapsed: 0,
    duration: 0,
  },
  states: {
    loading: {
      on: {
        LOADED: 'ready',
        FAILED: 'failure',
      },
    },
    ready: {
      initial: 'paused',
      entry: 'setVideo',
      states: {
        paused: {
          entry: 'pauseVideo',
          on: {
            PLAY: 'playing',
          },
        },
        playing: {
          entry: 'playVideo',
          on: {
            PAUSE: 'paused',
            TIMING: {
              target: 'playing',
              actions: 'setElapsed',
            },
            END: 'ended',
          },
        },
        ended: {
          entry: 'pauseVideo',
          on: {
            RESTART: 'playing'
          },
        },
      },
    },
    failure: {
      type: 'final',
    },
  },
});

const VideoPlayer = ({ sources, videoProps }: VideoPlayerProps) => {
  const videoRef = useRef(null);

  const [current, send] = useMachine(videoMachine, {
    actions: {
      setVideo: assign({
        video: (context, { video }) => video,
        duration: (context, { video }) => video.duration,
      }),
      playVideo: ({ video }) => {
        video.play();
      },
      pauseVideo: ({ video }) => {
        video.pause();
      },
      setElapsed: assign({
        elapsed: ({ video }) => video.currentTime,
      }),
    },
  });

  const { duration, elapsed } = current.context;

  const isPlaying = () => current.matches({ ready: 'playing' });
  const hasEnded = () => current.matches({ ready: 'ended' });

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return minutes + ':' + ('0' + seconds).substr(-2);
  };

  return (
    <Card>
      <CardMedia>
        <video
          {...videoProps}
          ref={videoRef}
          onCanPlay={() => send('LOADED', { video: videoRef.current })}
          onError={() => send('FAILED')}
          onEnded={() => send('END')}
          onTimeUpdate={() => send('TIMING')}
        >
          {sources.map((sourceProps, index) => <source key={index} {...sourceProps} />)}
        </video>
      </CardMedia>
      <CardActions disableSpacing>
        <Grid container alignItems="center">
          <Grid item>
            <Box mr={1}>
              {(() => {
                switch (true) {
                  case isPlaying():
                    return (
                      <IconButton
                        aria-label="pause"
                        onClick={() => send('PAUSE')}
                      >
                        <Pause />
                      </IconButton>
                    )
                  case hasEnded():
                    return (
                      <IconButton
                        aria-label="restart"
                        onClick={() => send('RESTART')}
                      >
                        <Replay />
                      </IconButton>
                    );
                  default:
                    return (
                      <IconButton
                        aria-label="play"
                        onClick={() => send('PLAY')}
                      >
                        <PlayArrow />
                      </IconButton>
                    );
                }
              })()}
            </Box>
          </Grid>
          <Grid item>
            <Typography>{formatTime(elapsed)} / {formatTime(duration)}</Typography>
          </Grid>
          <Grid item xs>
            <Box display="flex" alignItems="center" ml={3} mr={3}>
              <Slider aria-label="volume" max={duration} value={elapsed} />
            </Box>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default VideoPlayer;
