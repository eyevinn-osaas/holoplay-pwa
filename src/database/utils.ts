import { db } from ".";
import { Playlist } from "../types/interfaces/Playlist";
import { SearchHistory } from "../types/interfaces/Search";
import { Settings } from "../types/interfaces/Settings";
import { Video } from "../types/interfaces/Video";

export const getSettings = (): Settings => {
  return db.queryAll("settings", { query: { ID: 1 } })[0];
};

export const getFavoritePlaylist = (): Playlist => {
  return db.queryAll("playlists", { query: { title: "Favorites" } })[0];
};

const removeDuplicateVideoId = (videos: Video[]): Video[] => {
  return videos.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.videoId === value.videoId),
  );
};

export const importVideosToFavorites = (importedVideos: Video[]): void => {
  db.update("playlists", { title: "Favorites" }, (raw: Playlist) => ({
    ...raw,
    videos: removeDuplicateVideoId([...importedVideos, ...raw.videos]),
  }));
  db.commit();
};

export const importPlaylist = (playlist: {
  title: string;
  videos: Video[];
  videoCount: number;
}): void => {
  db.insert("playlists", {
    createdAt: new Date().toISOString(),
    title: playlist.title,
    videos: playlist.videos,
    videoCount: playlist.videoCount,
    type: "playlist",
  });
  db.commit();
};

export const getPlaylists = (): Playlist[] => {
  return db.queryAll("playlists", {
    query: (row: Playlist) => row.title !== "Favorites",
  });
};

export const getAllPlaylists = (): Playlist[] => {
  return db.queryAll("playlists");
};

export const getLocalPlaylists = (): Playlist[] => {
  return db.queryAll("playlists", {
    query: (row: Playlist) => row.title !== "Favorites" && !row.playlistId,
  });
};

export const getPlaylist = (playlistId: number): Playlist => {
  return db.queryAll("playlists", { query: { ID: playlistId } })[0];
};

export const getVideosHistory = (): Video[] => {
  return db.queryAll("history", {
    sort: [["ID", "DESC"]],
  });
};

export const getLastVideoPlayed = (): Video => {
  return getVideosHistory()[0];
};

export const getSearchHistory = (): SearchHistory[] => {
  return db.queryAll("searchHistory", {
    sort: [["ID", "DESC"]],
    limit: 5,
  });
};
