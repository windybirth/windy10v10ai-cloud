import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["City", "2010 Population", "2000 Population"],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["啊啊啊啊", 2099000, 1953000],
];

// export const options = {
//   title: "Population of Largest U.S. Cities",
//   chartArea: { width: "70%"},
//   hAxis: {
//     title: "Total Population",
//     minValue: 0,
//   },
//   vAxis: {
//     title: "City",
//   },
//   bar: {groupWidth: "75%"},
// };
export const options = {
    chart: {
      title: "Population of Largest U.S. Cities",
      subtitle: "Based on most recent and previous census data",
    },
    hAxis: {
      title: "Total Population",
      minValue: 0,
    },
    vAxis: {
      title: "City",
    },
    bars: "horizontal",
    axes: {
      y: {
        0: { side: "right" },
      },
    },
    bar: {groupWidth: "75%"},
  };

export function App() {
  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="1600px"
      data={data}
      options={options}
    />
  );
}
