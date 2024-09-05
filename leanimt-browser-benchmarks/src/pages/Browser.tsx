import { useState } from "react"

import { generateBenchmarks } from "../utils/generate-benchmarks"

import Table from "../components/Table"

export default function Browser() {
  const [tableInfo, setTableInfo] = useState()

  const renderTable = async () => {
    const benchmarksInfo = await generateBenchmarks()
    setTableInfo(benchmarksInfo as any)
  }

  const downloadData = async () => {
    const filename = "functions-browser"

    const jsonStr = JSON.stringify(tableInfo, null, 2)
    const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(jsonStr)}`
    const link = document.createElement("a")
    link.href = dataUri
    link.download = `${filename}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center my-10">
        <div className="w-96 text-xl text-center">
          Generate the browser benchmarks for the LeanIMT in TypeScript and the
          LeanIMT WebAssembly (Wasm) compiled from the Rust implementation.
        </div>
        <button
          onClick={renderTable}
          className="mt-5 rounded-md bg-blue-700 py-2 px-5 font-semibold hover:bg-blue-600 transition-colors duration-150 text-white"
        >
          Generate Benchmarks
        </button>
      </div>
      <div>
        {tableInfo ? (
          <div className="flex justify-center items-center mb-10">
            <button
              className="max-w-fit rounded-md bg-blue-700 py-2 px-5 font-semibold hover:bg-blue-600 transition-colors duration-150 text-white"
              onClick={downloadData}
            >
              Download Benchmarks
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div>
        {tableInfo ? (
          <div className="flex justify-center items-center my-5">
            <Table data={tableInfo} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
