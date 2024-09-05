import Insert from "../assets/data/insert.json"

import LineChart from "./LineChart"

export default function InsertLineChart() {
  return (
    <div className="flex flex-col justify-center items-center my-10">
      <LineChart
        series={[
          {
            name: "IMT",
            data: Insert[0].samples
          },
          {
            name: "LeanIMT",
            data: Insert[1].samples
          }
        ]}
        options={{
          chart: {
            id: "line-insert"
          },
          xaxis: {
            categories: Array.from({ length: 100 }, (_, i) => i + 1),
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
