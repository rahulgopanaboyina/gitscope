import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import "highcharts/modules/accessibility";

import {
  prepareCommitData,
  prepareCodeFrequency,
} from "../utils/analyticsUtils";

function WeeklyActivityChart({
  selectedMetric,
  commitActivity,
  codeFrequency,
}) {
  const chartData =
    selectedMetric === "commits"
      ? prepareCommitData(commitActivity).map((week) => ({
          x: week.timestamp,
          y: week.commits,
        }))
      : prepareCodeFrequency(codeFrequency).map((week) => ({
          x: week.timestamp,
          y: selectedMetric === "additions" ? week.additions : week.deletions,
        }));

  const options = {
    chart: {
      type: "area",
      backgroundColor: "transparent",
      height: 350,
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
      shared: true,
      xDateFormat: "%d %b %Y",
      pointFormat:
        '<span style="color:{series.color}">●</span> ' +
        "{series.name}: <b>{point.y:,.0f}</b><br/>",
    },

    legend: {
      enabled: false,
    },

    credits: {
      enabled: false,
    },

    series: [
      {
        name: selectedMetric,
        data: chartData,
        color: "#22d3ee",
        fillOpacity: 0.15,
      },
    ],
  };

  return (
    <div className="chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default WeeklyActivityChart;
