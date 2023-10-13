import {
  ActionIcon,
  Box,
  Drawer,
  Flex,
  ScrollArea,
  Slider,
  Space,
  Text,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { useDocumentTitle, useMediaQuery } from "@mantine/hooks";
import { IconPlaylist, IconVolume } from "@tabler/icons-react";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  usePlayerAudio,
  usePlayerState,
  usePlayerUrl,
  usePlayerVideo,
} from "../providers/Player";
import { usePlayerPlaylist } from "../providers/PlayerPlaylist";
import { ButtonDownload } from "./ButtonDownload";
import { ButtonFavorite } from "./ButtonFavorite";
import { ButtonPlayerModeVideo } from "./ButtonPlayerModeVideo";
import { ButtonRepeat } from "./ButtonRepeat";
import { ButtonShare } from "./ButtonShare";
import { PlayerActions } from "./PlayerActions";
import { PlayerBackground } from "./PlayerBackground";
import { PlayerLoadingOverlay } from "./PlayerLoadingOverlay";
import { PlayerProgress } from "./PlayerProgress";
import { VideoList } from "./VideoList";

const useStyles = createStyles((theme) => ({
  container: {
    position: "absolute",
    zIndex: 3,
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: "10px 0 10px rgb(0 0 0 / 20%)",
  },
  content: {
    padding: theme.spacing.sm,

    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      padding: theme.spacing.xl,
    },
  },
  videoInformationsContainer: {
    maxWidth: 100,

    [`@media (min-width: ${theme.breakpoints.sm})`]: {
      maxWidth: 320,
      overflow: "hidden",
    },

    [`@media (min-width: ${theme.breakpoints.md})`]: {
      maxWidth: 280,
    },

    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      maxWidth: 320,
    },

    [`@media (min-width: 2100px)`]: {
      maxWidth: 440,
    },
  },
  volume: {},
  thumbnail: {
    flex: "0 0 50px",
    height: 50,
    borderRadius: theme.radius.md,

    [`@media (max-width: ${theme.breakpoints.lg})`]: {
      display: "none",
    },
  },
}));

export const Player = memo(() => {
  const { classes } = useStyles();
  const matches = useMediaQuery("(max-width: 2140px)");
  const theme = useMantineTheme();
  const showProgressBar = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const showVolumeBar = useMediaQuery(`(min-width: ${theme.breakpoints.xl})`);

  return (
    <Box
      className={classes.container}
      style={{ display: matches ? "block" : "none" }}
    >
      <Flex align="center" className={classes.content}>
        <PlayerLoadingOverlay />
        {matches ? (
          <>
            <PlayerBackground />
            <VideoInformations />
            <Space w={60} />
            <Flex align="center" style={{ flex: 1 }}>
              <PlayerActions />
              <Space w={60} />
              {showProgressBar ? (
                <>
                  <PlayerProgress />
                  <Space w={60} />
                </>
              ) : null}
              <ButtonRepeat iconSize={20} />
              <Space w="lg" />
              <ButtonDownload iconSize={20} />
              <Space w="lg" />
              <ButtonShare iconSize={20} />
              <Space w="lg" />
              <ButtonPlayerModeVideo />
              <Space w="lg" />
              <ButtonFavorite iconSize={20} variant="transparent" />
              {showVolumeBar ? (
                <>
                  <Space w={20} />
                  <PlayerVolume />
                </>
              ) : null}
              <Space w={40} />
              <PlayerPlaylist />
            </Flex>
          </>
        ) : null}
      </Flex>
    </Box>
  );
});

const VideoInformations = memo(() => {
  const { classes } = useStyles();
  const { video, thumbnailUrl } = usePlayerVideo();

  useDocumentTitle(video?.title as string);

  return (
    <Flex
      align="center"
      className={classes.videoInformationsContainer}
      gap="lg"
    >
      <Box
        style={{
          background: `url(${thumbnailUrl}) center center / cover grey`,
        }}
        className={classes.thumbnail}
      />
      <Box maw="100%">
        <Text color="white" lineClamp={1}>
          {video?.title}
        </Text>
        <Text color="white" size="sm" lineClamp={1}>
          {video?.description}
        </Text>
      </Box>
    </Flex>
  );
});

const PlayerVolume = memo(() => {
  const { classes } = useStyles();
  const playerState = usePlayerState();
  const playerAudio = usePlayerAudio();

  const handleChangeEnd = (volume: number) => {
    // @ts-ignorex
    const audio = playerAudio?.current?.audioEl.current as HTMLAudioElement;
    audio.volume = volume / 100;
  };

  return (
    <Flex align="center" gap="sm" w={140} className={classes.volume}>
      <ActionIcon>
        <IconVolume size={20} />
      </ActionIcon>
      <Box style={{ flex: 1 }}>
        <Slider
          value={playerState.volume * 100}
          size="xs"
          styles={{
            thumb: { display: "none" },
            bar: { background: "white" },
          }}
          onChangeEnd={handleChangeEnd}
        />
      </Box>
    </Flex>
  );
});

const PlayerPlaylist = memo(() => {
  const [opened, setOpened] = useState(false);
  const videosPlaylist = usePlayerPlaylist();
  const { t } = useTranslation();

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("player.next.song")}
        padding="xl"
        position="right"
        size="xl"
      >
        <ScrollArea style={{ height: "calc(100vh - 80px)" }}>
          <VideoList videos={videosPlaylist} />
        </ScrollArea>
      </Drawer>
      <ActionIcon onClick={() => setOpened(true)}>
        <IconPlaylist size={20} />
      </ActionIcon>
    </>
  );
});

export const PlayerSpace = memo(() => {
  const playerUrl = usePlayerUrl();
  const matches = useMediaQuery("(max-width: 2140px)");
  const height = playerUrl && matches ? 98 : 0;

  return <Box style={{ height }} />;
});
