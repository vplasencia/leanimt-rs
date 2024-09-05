import { useState, useEffect } from "react"

import FunctionsBrowser from "./assets/data/functions-browser.json"
import FunctionsNode from "./assets/data/functions-node.json"

import Table from "./components/Table"

import { Link } from "react-router-dom"

import LineChart from "./components/LineChart"

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
      <LineChart
        options={{
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          }
        }}
        series={[
          {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91]
          }
        ]}
        key={"basic-bar"}
      />
    </div>
  )
}
