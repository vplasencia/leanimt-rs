import { useState } from "react"
import { generateBenchmarks } from "../utils/generate-benchmarks"
import Table from "../components/Table"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Browser() {
  const [tableInfo, setTableInfo] = useState()
  const [samples, setSamples] = useState(100)

  const getTableInfo = async () => {
    const benchmarksInfo = await generateBenchmarks(samples)
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
    <div className="flex flex-col min-h-screen px-2 text-slate-950">
      <Header />
      <div className="mb-auto">
        <div className="flex flex-col justify-center items-center my-10">
          <div className="w-96 text-xl text-center">
            Generate the browser benchmarks for the LeanIMT in TypeScript and
            the LeanIMT WebAssembly (Wasm) compiled from the Rust
            implementation.
          </div>
          <div className="w-fit mt-5 flex flex-col justify-center items-center">
            <div>
              <div>Samples</div>
              <input
                type="number"
                id="number-input"
                aria-describedby="helper-text-explanation"
                className="border border-gray-300 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                placeholder="1234"
                defaultValue={100}
                min={0}
                required
                onChange={(e) => setSamples(parseInt(e.target.value))}
              />
            </div>

            <button
              onClick={getTableInfo}
              className="mt-5 rounded-md bg-indigo-700 py-2 px-5 font-semibold hover:bg-indigo-600 transition-colors duration-150 text-white"
            >
              Generate Benchmarks
            </button>
          </div>
        </div>
        <div>
          {tableInfo ? (
            <div className="flex justify-center items-center mb-10">
              <button
                className="max-w-fit rounded-md bg-indigo-700 py-2 px-5 font-semibold hover:bg-indigo-600 transition-colors duration-150 text-white"
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
      <Footer />
    </div>
  )
}
