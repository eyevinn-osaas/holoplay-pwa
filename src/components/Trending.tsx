import { Alert, LoadingOverlay, Text } from "@mantine/core";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getTrendings } from "../services/trending";
import { CardList } from "./CardList";
import { useTrendingFiltersValues } from "../providers/TrendingFilters";
import { HorizontalGridList } from "./HorizontalGridList";

interface TrendingProps {
  horizontal?: boolean;
}

export const Trending: React.FC<TrendingProps> = memo(
  ({ horizontal = false }) => {
    const trendingFiltersValues = useTrendingFiltersValues();
    const query = useQuery(
      `trending-${trendingFiltersValues.type}-${trendingFiltersValues.region}`,
      () => getTrendings(trendingFiltersValues),
      {
        enabled: Boolean(trendingFiltersValues.region),
      }
    );
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
          keyPrefix="horizontal-trending"
        />
      );
    }

    return <CardList data={query.data} />;
  }
);
