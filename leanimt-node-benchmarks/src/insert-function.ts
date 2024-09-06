import { Bench, Task } from "tinybench"
import { LeanIMT, LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"

import * as wasm from "../wasm/pkg/leanimt_poseidon_rs"

import { saveInfoJSON } from "./utils/save-info"

import { downsampleData } from "./utils/downsample-data"

const createDataToSave = (bench: Bench) => {
  const result = bench.tasks.map((task, i) => {
    if (task === undefined || task.result === undefined) return "NaN"

    let text = ""

    if (task.name.includes("LeanIMTWasm")) {
      const leanIMTAvgExecTime = bench.tasks[i - 1].result?.mean

      const leanIMTWasmAvgExecTime = bench.tasks[i]!.result?.mean

      if (
        leanIMTAvgExecTime === undefined ||
        leanIMTWasmAvgExecTime === undefined
      )
        return "NaN"

      if (leanIMTAvgExecTime > leanIMTAvgExecTime) {
        text = `${(leanIMTAvgExecTime / leanIMTWasmAvgExecTime).toFixed(2)} x faster`
      } else {
        text = `${(leanIMTWasmAvgExecTime / leanIMTAvgExecTime).toFixed(2)} x slower`
      }
    }

    // Downsample data for better visualization
    const downsampleRate = 300

    let x = Array.from({ length: task.result.samples.length }, (_, i) => i + 1)
    let y = task.result.samples

    x = downsampleData(x, downsampleRate)
    y = downsampleData(y, downsampleRate)

    return {
      Function: task.name,
      "ops/sec": task.result.error
        ? "NaN"
        : parseInt(task.result.hz.toString(), 10),
      "Average Time (ms)": task.result.error
        ? "NaN"
        : task.result.mean.toFixed(5),
      Samples: task.result.error ? "NaN" : task.result.samples.length,
      "Relative to IMT": text,
      xaxis: x,
      yaxis: y
    }
  })

  return result
}

const generateTable = (task: Task) => {
  if (task && task.name && task.result) {
    return {
      Function: task.name,
      "ops/sec": task.result.error
        ? "NaN"
        : parseInt(task.result.hz.toString(), 10).toLocaleString(),
      "Average Time (ms)": task.result.error
        ? "NaN"
        : task.result.mean.toFixed(5),
      Samples: task.result.error ? "NaN" : task.result.samples.length
    }
  }
}

async function main() {
  const samples = 10000

  const bench = new Bench({ time: 0, iterations: samples })

  const leanIMTHash = (a: any, b: any) => poseidon2([a, b])

  let leanIMT: LeanIMT

  let leanIMTWasm: any

  bench
    .add(
      "LeanIMT - Insert",
      async () => {
        leanIMT.insert(1n)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
        }
      }
    )
    .add(
      "LeanIMTWasm - Insert",
      async () => {
        leanIMTWasm.insert("1")
      },
      {
        beforeAll: () => {
          leanIMTWasm = new wasm.LeanIMTPoseidon([])
        }
      }
    )

  // await bench.warmup();
  await bench.run()

  const filePath = "./data/insert-node.json"
  saveInfoJSON(createDataToSave(bench), filePath)

  const table = bench.table((task) => generateTable(task))

  // Add column to show how many times the LeanIMT is faster than the IMT.
  // Formula: IMT average execution time divided by LeanIMT average execution time.
  // Using LeanIMT ops/sec divided by IMT ops/sec would work too.
  table.map((rowInfo, i) => {
    if (rowInfo && !(rowInfo["Function"] as string).includes("LeanIMTWasm")) {
      rowInfo["Relative to LeanIMT"] = ""
    } else if (rowInfo) {
      const leanIMTAvgExecTime = bench.tasks[i - 1].result?.mean

      const leanIMTWasmAvgExecTime = bench.tasks[i]!.result?.mean

      if (
        leanIMTAvgExecTime === undefined ||
        leanIMTWasmAvgExecTime === undefined
      )
        return

      if (leanIMTAvgExecTime > leanIMTWasmAvgExecTime) {
        rowInfo["Relative to LeanIMT"] = `${(
          leanIMTAvgExecTime / leanIMTWasmAvgExecTime
        ).toFixed(2)} x faster`
      } else {
        rowInfo["Relative to LeanIMT"] = `${(
          leanIMTWasmAvgExecTime / leanIMTAvgExecTime
        ).toFixed(2)} x slower`
      }
    }
  })

  console.table(table)

  // console.log(bench.results)
}

main()
