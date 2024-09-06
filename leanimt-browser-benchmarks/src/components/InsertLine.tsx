import Insert from "../assets/data/insert-node.json"

import LineChart from "./LineChart"

export default function InsertLineChart() {
  return (
    <div className="flex flex-col justify-center items-center my-10">
      <LineChart
        series={[
          {
            name: "LeanIMT",
            data: Insert[0].yaxis
          },
          {
            name: "LeanIMTWasm",
            data: Insert[1].yaxis
          }
        ]}
        options={{
          chart: {
            id: "line-insert"
          },
          colors: ["#3b82f6", "#a855f7"],
          xaxis: {
            categories: Insert[0].xaxis,
            title: {
              text: "Members"
            },
            labels: {
              show: true,
              rotate: 0,
              rotateAlways: true,
              hideOverlappingLabels: true,
              trim: false
            },
            tickAmount: 5
          },
          yaxis: [
            {
              title: {
                text: "Time (ms)"
              },
              labels: {
                formatter: function (val: number) {
                  return val.toFixed(2)
                }
              }
            }
          ]
        }}
        key={"basic-bar"}
      />
    </div>
  )
}
