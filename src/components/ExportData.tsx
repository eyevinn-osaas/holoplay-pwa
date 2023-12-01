import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAllPlaylists } from "../database/utils";
import { generateAndDownloadFile } from "../utils/generateAndDownloadFile";
import { ModalExportFilename } from "./ModalExportFilename";
import { TransferList } from "./TransferList";

const loadPlaylistData = (playlistsTitle: string[]) =>
  getAllPlaylists().filter((p) => playlistsTitle.includes(p.title));

export const ExportData = memo(() => {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation("translation", {
    keyPrefix: "settings.data.export",
  });
  const [exportData, setExportData] = useState<string[]>([]);
  const userData = useMemo(() => getAllPlaylists().map((p) => p.title), []);

  const handleDownloadFile = useCallback(
    (fileName: string) => {
      const playlists = loadPlaylistData(exportData);
      generateAndDownloadFile({ playlists }, fileName);
      notifications.show({
        title: t("notification.title"),
        message: t("notification.message"),
      });
    },
    [exportData, t],
  );

  const handleSubmit = useCallback((importData: string[]) => {
    setExportData(importData);
    setOpened(true);
  }, []);

  return (
    <Box mt="lg">
      <TransferList
        data={userData}
        handleSubmit={handleSubmit}
        buttonSubmitLabel={t("button.submit")}
      />
      <ModalExportFilename
        opened={opened}
        onClose={() => setOpened(false)}
        onSubmit={handleDownloadFile}
      />
    </Box>
  );
});
