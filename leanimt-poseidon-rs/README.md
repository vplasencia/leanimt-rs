# LeanIMT + Poseidon in Rust

This folder contains the LeanIMT implementation with Poseidon in Rust. The idea is to use this library to compile the Rust code to WASM.

To compile the Rust code to WASM, it was used the 

[`wasm-pack`](https://rustwasm.github.io/docs/wasm-pack/introduction.html) was used to compile the Rust code into WASM.

To compile the Rust code for Node.js, run:

```bash
wasm-pack build --target nodejs
```

To compile the Rust code for Browser, run:

```bash
wasm-pack build --target web
```

Those commands will generate a folder called `pkg` that you can use inside your Node.js or Web application respectively.

Example of using the `pkg` folder inside Nodejs: [`leanimt-node-benchmarks`](../leanimt-node-benchmarks/README.md). 

Example of using the `pkg` folder inside a Web application: [`leanimt-browser-benchmarks`](../leanimt-browser-benchmarks/README.md). 
