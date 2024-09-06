import { useState } from "react"
import { generateBenchmarks } from "../utils/generate-benchmarks"
import Table from "../components/Table"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Browser() {
  const [tableInfo, setTableInfo] = useState()
  const [samples, setSamples] = useState(100)
  const [loading, setLoading] = useState(false)

  const getTableInfo = async () => {
    setLoading(true)
    const benchmarksInfo = await generateBenchmarks(samples)
    setTableInfo(benchmarksInfo as any)
    setLoading(false)
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
          <div className="mt-5 flex flex-col justify-center items-center">
            <div className="flex flex-col space-y-1">
              <div>Samples</div>
              <input
                type="number"
                id="number-input"
                aria-describedby="helper-text-explanation"
                className="w-52 border border-gray-300 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                placeholder="1234"
                defaultValue={100}
                min={0}
                required
                onChange={(e) => setSamples(parseInt(e.target.value))}
              />
            </div>

            <button
              onClick={getTableInfo}
              className="w-full mt-5 rounded-md bg-indigo-700 py-3 px-5 font-semibold hover:bg-indigo-600 transition-colors duration-150 text-white"
            >
              Generate Benchmarks
            </button>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center items-center space-x-3">
              <div className="loader"></div>
              <div>Generating benchmarks</div>
            </div>
          ) : tableInfo ? (
            <div>
              <div className="flex justify-center items-center mb-10">
                <button
                  className="max-w-fit rounded-md bg-indigo-700 py-3 px-5 font-semibold hover:bg-indigo-600 transition-colors duration-150 text-white"
                  onClick={downloadData}
                >
                  Download Benchmarks
                </button>
              </div>
              <div className="flex justify-center items-center my-5">
                <Table data={tableInfo} />
              </div>
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
