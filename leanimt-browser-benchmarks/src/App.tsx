import { useEffect } from "react"

import { generateBenchmarks } from "./utils/generate-benchmarks"

export default function Browser() {
  // useEffect(()=> {
  //   const wasmFunction = async () => {
  //     await generateBenchmarks()
  //   }
  //   wasmFunction()
  // }, [])
  return (
    <div>
      <button onClick={generateBenchmarks}>Generate Benchmarks</button>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  )
}
