import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import "highcharts/modules/accessibility";

import { prepareContributorData } from "../utils/analyticsUtils";

function ContributorActivityChart({ contributors, selectedMetric }) {
  const contributorData = prepareContributorData(contributors, selectedMetric);

  const series = contributorData.map((contributor) => ({
    name: contributor.name,
    data: contributor.weeklyActivity.map((week) => ({
      x: week.timestamp,
      y: week[selectedMetric],
    })),
  }));

  const options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      height: 400,
    },

    title: {
      text: null,
    },

    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: "#94a3b8",
        },
      },
    },

    yAxis: {
      title: {
        text: "Activity count",
        style: {
          color: "#94a3b8",
        },
      },
      min: 0,
      gridLineColor: "#263247",
    },

    tooltip: {
      shared: false,
      xDateFormat: "%d %b %Y",
      headerFormat:
        '<span style="font-size: 12px">Week starting: {point.key:%d %b %Y}</span><br/>',
      pointFormat:
        '<span style="color:{series.color}">●</span> ' +
        "<b>{series.name}</b><br/>Activity: <b>{point.y:,.0f}</b>",
    },

    legend: {
      enabled: true,
      itemStyle: {
        color: "#94a3b8",
      },
      itemHoverStyle: {
        color: "#22d3ee",
      },
    },

    credits: {
      enabled: false,
    },

    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },

    series,
  };

  return (
    <div className="chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default ContributorActivityChart;
