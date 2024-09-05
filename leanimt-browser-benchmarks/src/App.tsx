import { useState, useEffect } from "react"

import FunctionsBrowser from "./assets/data/functions-browser.json"
import FunctionsNode from "./assets/data/functions-node.json"

import Table from "./components/Table"

import { Link } from "react-router-dom"

import LineChart from "./components/LineChart"

import Insert from "./assets/data/insert.json"

export default function Browser() {
  // const [tableInfo, setTableInfo] = useState(FunctionsBrowser)
  const [functionsBrowser, setFunctionsBrowser] = useState({
    options: {
      chart: {
        id: "id"
      },
      xaxis: {
        categories: [0]
      }
    },
    series: [
      {
        name: "series",
        data: [0]
      }
    ]
  })

  // useEffect(() => {
  //   const functionsBrowserData = {
  //     options: {
  //       chart: {
  //         id: "basic-bar"
  //       },
  //       xaxis: {
  //         categories: [1]
  //       }
  //     },
  //     series: [
  //       {
  //         name: "series-1",
  //         data: [1]
  //       }
  //     ]
  //   }
  //   setFunctionsBrowser(temp)
  // }, [])

  if (!functionsBrowser) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Link to="/browser">Browser Benchmarks</Link>
      <div className="flex flex-col justify-center items-center my-10">
        <div>Node.js</div>
        <div className="flex justify-center items-center my-5">
          <Table data={FunctionsBrowser} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center my-10">
        <div>Browser</div>
        <div className="flex justify-center items-center my-5">
          <Table data={FunctionsNode} />
        </div>
      </div>
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
    </div>
  )
}
