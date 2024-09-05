import { useState, useEffect } from "react"

import TableNode from "./components/TableNode"

import TableBrowser from "./components/TableBrowser"

import { Link } from "react-router-dom"

import InsertLineChart from "./components/InsertLine"

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
        <TableNode />
      </div>
      <div className="flex flex-col justify-center items-center my-10">
        <div>Browser</div>
        <TableBrowser />
      </div>
      <InsertLineChart />
    </div>
  )
}
