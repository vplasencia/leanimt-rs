# LeanIMT in Rust

The goal of this project is to benchmark the LeanIMT JS library and the Rust implementation compiled to WASM in both Node.js and browser environments. The objective is to determine whether this data structure is more suitable for use in the Semaphore protocol and other projects as a JS package or a WASM file. 

This research and development can serve as a reference for teams looking to optimize their JS projects by using WASM files.

The LeanIMT is the data structure used in [Semaphore v4](https://docs.semaphore.pse.dev/).

## Steps to generate the results

#### 1. Implement the LeanIMT in Rust

The first step was to implement the LeanIMT in Rust, as no prior implementation existed.

The [LeanIMT TypeScript](https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/lean-imt) implementation was used as a reference.

Code: [LeanIMT in Rust](./leanimt-rs).

#### 2. Implement the LeanIMT with the Poseidon hash function in Rust

Since the LeanIMT implementation in Rust allows devs to use the hash function they prefer, it was necesary to create a new library in Rust combining the LeanIMT and the Poseidon hash function.

Code: [LeanIMT + Poseidon in Rust](./leanimt-poseidon-rs)

#### 3. Generate the WASM file from LeanIMT + Poseidon implementation in Rust

When all the Rust code was ready, it was time to generate the WASM file from the LeanIMT + Poseidon Rust library using [`wasm-pack`](https://rustwasm.github.io/docs/wasm-pack/introduction.html).

Code: [LeanIMT + Poseidon in Rust](./leanimt-poseidon-rs)

#### 4. Generate benchmarks in Node.js

Benchmarks were generated in Node.js by copying the pkg folder (produced by `wasm-pack`) into the Node.js project. The [`tinybench`](https://github.com/tinylibs/tinybench) library was used for benchmarking.

[`tinybench`](https://github.com/tinylibs/tinybench) was used for the benchmarks.

Code: [Benchmarks for the LeanIMT JS and LeanIMT WASM in Node.js](./leanimt-node-benchmarks)

#### 5. Generate benchmarks in Browser

A [Vite](https://vitejs.dev/) + [React](https://react.dev/) project was created to benchmark the LeanIMT JS library and the WASM-compiled LeanIMT + Poseidon Rust implementation in the browser. The [`tinybench`](https://github.com/tinylibs/tinybench) library was used for these benchmarks.

Code: [Benchmarks for the LeanIMT JS and LeanIMT WASM in Browser](./leanimt-browser-benchmarks/)

Live App: https://leanimt-benchmarks.vercel.app/

#### 6. Create a page with all the benchmarks together

The first page of the [browser benchmarks app](https://leanimt-benchmarks.vercel.app/) contains benchmarks from both Node.js and browser to allow for easier comparison and analysis.

## Benchmarks

All the benchmarks were run in an environment with these properties:

#### System Specifications

Computer: MacBook Pro

Chip: Apple M2 Pro

Memory (RAM): 16 GB

Operating System: macOS Sonoma version 14.5

#### Software environment

Node.js version: 20.5.1

Browser: Google Chrome Version 128.0.6613.120 (Official Build) (arm64)

## Results

For a few members in the tree the LeanIMT JS library used to be faster but as the number of members in the tree increased, the WASM library became faster.

In terms of file size, the JS library (equivalent to the [`@semaphore-protocol/group`](https://www.npmjs.com/package/@semaphore-protocol/group) package) is smaller with approximately `52.7 kb` while the WASM file is significantly larger, around `1.6 mb`. 

Compiling Rust code into WASM can be highly beneficial for Node.js (backend) projects that require intensive computations, such as cryptographic operations and handling complex data structures with large amounts of data.

Since errors are harder to detect when using WASM files, it's best to use Rust code compiled into WASM when the code is stable and unlikely to change frequently.

## Future work

- Optimize the LeanIMT implementation in Rust and create a crate and move the code to [zk-kit](https://github.com/privacy-scaling-explorations/zk-kit.rust).

- Optimize WASM size [[1]](https://rustwasm.github.io/docs/book/game-of-life/hello-world.html#wasm-game-of-lifesrclibrs). 

- Improve the [App UI](https://leanimt-benchmarks.vercel.app/) to make it easier for people to upload their own generated data allowing them to view charts with their data and analyze the results.

