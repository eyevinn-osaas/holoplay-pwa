import { Alert, LoadingOverlay, Text } from "@mantine/core";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getPopuplars } from "../services/popular";
import { CardList } from "./CardList";
import { HorizontalGridList } from "./HorizontalGridList";

interface PopularProps {
  horizontal?: boolean;
}

export const Popular: React.FC<PopularProps> = memo(({ horizontal }) => {
  const query = useQuery("most-popular", () => getPopuplars());
  const { t } = useTranslation();

  if (!query.data) {
    return <LoadingOverlay visible />;
  }

  if (query.error) {
    return <div>{t("error")}</div>;
  }

  if (horizontal) {
    if (!query.data.length) {
      return (
        <Alert title={t("recently.play.alert.title")}>
          <Text>{t("recently.play.alert.message")}</Text>
        </Alert>
      );
    }
    return (
      <HorizontalGridList
        data={query.data.slice(0, 10)}
        keyPrefix="horizontal-popular"
      />
    );
  }

  return <CardList data={query.data} />;
});
