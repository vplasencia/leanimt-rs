import TableNode from "./components/TableNode"

import TableBrowser from "./components/TableBrowser"

import { Link } from "react-router-dom"

import InsertLineChart from "./components/InsertLine"

export default function App() {
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
