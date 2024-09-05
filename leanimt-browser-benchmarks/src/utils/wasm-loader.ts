export const loadWasm = async () => {
  const wasm = await import("../assets/wasm/pkg/leanimt_poseidon_rs.js")

  await wasm.default()
  return wasm
}
