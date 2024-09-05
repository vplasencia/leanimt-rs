import { useState } from "react"

import { generateBenchmarks } from "./utils/generate-benchmarks"

import Table from "./components/Table"

export default function Browser() {
  const [tableInfo, setTableInfo] = useState()

  // useEffect(()=> {
  //   const wasmFunction = async () => {
  //     await generateBenchmarks()
  //   }
  //   wasmFunction()
  // }, [])

  const renderTable = async () => {
    const benchmarksInfo = await generateBenchmarks()
    setTableInfo(benchmarksInfo as any)
  }

  return (
    <div>
      <button onClick={renderTable}>Generate Benchmarks</button>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      {tableInfo ? (
        <div className="flex justify-center items-center my-5">
          <Table data={tableInfo} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
