import { Bench, Task } from "tinybench"
import { LeanIMT, LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"

import * as wasm from "../wasm/pkg/leanimt_poseidon_rs"

import { saveInfoJSON } from "./utils/save-info"

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

  let index: number

  let proofLeanIMT: LeanIMTMerkleProof

  let proofLeanIMTWasm: string[]

  // Members to insert in when running the inserMany function
  let membersLeanIMT: bigint[]

  let membersLeanIMTWasm: string[]

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
    .add(
      "LeanIMT - InsertMany",
      async () => {
        leanIMT.insertMany(membersLeanIMT)
      },
      {
        beforeAll: () => {
          membersLeanIMT = []
        },
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          membersLeanIMT.push(1n)
        }
      }
    )
    .add(
      "LeanIMTWasm - InsertMany",
      async () => {
        leanIMTWasm.insert_many(membersLeanIMTWasm)
      },
      {
        beforeAll: () => {
          membersLeanIMTWasm = []
        },
        beforeEach: () => {
          leanIMTWasm = new wasm.LeanIMTPoseidon([])
          membersLeanIMTWasm.push("1")
        }
      }
    )
    .add(
      "LeanIMT - Update",
      async () => {
        leanIMT.update(index, 2n)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
        },
        beforeEach: () => {
          leanIMT.insert(1n)
          index = Math.floor(leanIMT.size / 2)
        }
      }
    )
    .add(
      "LeanIMTWasm - Update",
      async () => {
        leanIMTWasm.update(index, "2")
      },
      {
        beforeAll: () => {
          leanIMTWasm = new wasm.LeanIMTPoseidon([])
        },
        beforeEach: () => {
          leanIMTWasm.insert("1")
          index = Math.floor(leanIMTWasm.size() / 2)
        }
      }
    )
    .add(
      "LeanIMT - GenerateProof",
      async () => {
        leanIMT.generateProof(index)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
        },
        beforeEach: () => {
          leanIMT.insert(1n)
          index = Math.floor(leanIMT.size / 2)
        }
      }
    )
    .add(
      "LeanIMTWasm - GenerateProof",
      async () => {
        leanIMTWasm.generate_proof(index)
      },
      {
        beforeAll: () => {
          leanIMTWasm = new wasm.LeanIMTPoseidon([])
        },
        beforeEach: () => {
          leanIMTWasm.insert("1")
          index = Math.floor(leanIMTWasm.size() / 2)
        }
      }
    )
    .add(
      "LeanIMT - VerifyProof",
      async () => {
        leanIMT.verifyProof(proofLeanIMT)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
        },
        beforeEach: () => {
          leanIMT.insert(1n)
          index = Math.floor(leanIMT.size / 2)
          proofLeanIMT = leanIMT.generateProof(index)
        }
      }
    )
    .add(
      "LeanIMTWasm - VerifyProof",
      async () => {
        wasm.LeanIMTPoseidon.verify_proof(proofLeanIMTWasm)
      },
      {
        beforeAll: () => {
          leanIMTWasm = new wasm.LeanIMTPoseidon([])
        },
        beforeEach: () => {
          leanIMTWasm.insert("1")
          index = Math.floor(leanIMTWasm.size() / 2)
          proofLeanIMTWasm = leanIMTWasm.generate_proof(index)
        }
      }
    )

  // await bench.warmup();
  await bench.run()

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

  const filePath = "./data/functions-node.json"
  saveInfoJSON(table, filePath)
}

main()
