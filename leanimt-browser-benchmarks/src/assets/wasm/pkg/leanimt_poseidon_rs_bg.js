let wasm
export function __wbg_set_wasm(val) {
  wasm = val
}

const heap = new Array(128).fill(undefined)

heap.push(undefined, null, true, false)

function getObject(idx) {
  return heap[idx]
}

let heap_next = heap.length

function dropObject(idx) {
  if (idx < 132) return
  heap[idx] = heap_next
  heap_next = idx
}

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

const lTextDecoder =
  typeof TextDecoder === "undefined"
    ? (0, module.require)("util").TextDecoder
    : TextDecoder

let cachedTextDecoder = new lTextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true
})

cachedTextDecoder.decode()

let cachedUint8ArrayMemory0 = null

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null ||
    cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8ArrayMemory0
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len)
  )
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}

let WASM_VECTOR_LEN = 0

const lTextEncoder =
  typeof TextEncoder === "undefined"
    ? (0, module.require)("util").TextEncoder
    : TextEncoder

let cachedTextEncoder = new lTextEncoder("utf-8")

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view)
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg)
        view.set(buf)
        return {
          read: arg.length,
          written: buf.length
        }
      }

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg)
    const ptr = malloc(buf.length, 1) >>> 0
    getUint8ArrayMemory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf)
    WASM_VECTOR_LEN = buf.length
    return ptr
  }

  let len = arg.length
  let ptr = malloc(len, 1) >>> 0

  const mem = getUint8ArrayMemory0()

  let offset = 0

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset)
    if (code > 0x7f) break
    mem[ptr + offset] = code
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset)
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len)
    const ret = encodeString(arg, view)

    offset += ret.written
    ptr = realloc(ptr, len, offset, 1) >>> 0
  }

  WASM_VECTOR_LEN = offset
  return ptr
}

function isLikeNone(x) {
  return x === undefined || x === null
}

let cachedDataViewMemory0 = null

function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer)
  }
  return cachedDataViewMemory0
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0
  const mem = getDataViewMemory0()
  for (let i = 0; i < array.length; i++) {
    mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true)
  }
  WASM_VECTOR_LEN = array.length
  return ptr
}

function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  const mem = getDataViewMemory0()
  const result = []
  for (let i = ptr; i < ptr + 4 * len; i += 4) {
    result.push(takeObject(mem.getUint32(i, true)))
  }
  return result
}

const LeanIMTPoseidonFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_leanimtposeidon_free(ptr >>> 0, 1)
      )
/**
 */
export class LeanIMTPoseidon {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    LeanIMTPoseidonFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_leanimtposeidon_free(ptr, 0)
  }
  /**
   * @param {(string)[]} leaves
   */
  constructor(leaves) {
    const ptr0 = passArrayJsValueToWasm0(leaves, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.leanimtposeidon_new(ptr0, len0)
    this.__wbg_ptr = ret >>> 0
    LeanIMTPoseidonFinalization.register(this, this.__wbg_ptr, this)
    return this
  }
  /**
   * @returns {string | undefined}
   */
  root() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.leanimtposeidon_root(retptr, this.__wbg_ptr)
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
      let v1
      if (r0 !== 0) {
        v1 = getStringFromWasm0(r0, r1).slice()
        wasm.__wbindgen_free(r0, r1 * 1, 1)
      }
      return v1
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * @returns {number}
   */
  depth() {
    const ret = wasm.leanimtposeidon_depth(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * @returns {(string)[]}
   */
  leaves() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.leanimtposeidon_leaves(retptr, this.__wbg_ptr)
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
      var v1 = getArrayJsValueFromWasm0(r0, r1).slice()
      wasm.__wbindgen_free(r0, r1 * 4, 4)
      return v1
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * @returns {number}
   */
  size() {
    const ret = wasm.leanimtposeidon_size(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * @param {string} leaf
   * @returns {number | undefined}
   */
  index_of(leaf) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      const ptr0 = passStringToWasm0(
        leaf,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      )
      const len0 = WASM_VECTOR_LEN
      wasm.leanimtposeidon_index_of(retptr, this.__wbg_ptr, ptr0, len0)
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
      return r0 === 0 ? undefined : r1 >>> 0
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * @param {string} leaf
   * @returns {boolean}
   */
  has(leaf) {
    const ptr0 = passStringToWasm0(
      leaf,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    )
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.leanimtposeidon_has(this.__wbg_ptr, ptr0, len0)
    return ret !== 0
  }
  /**
   * @param {string} leaf
   */
  insert(leaf) {
    const ptr0 = passStringToWasm0(
      leaf,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    )
    const len0 = WASM_VECTOR_LEN
    wasm.leanimtposeidon_insert(this.__wbg_ptr, ptr0, len0)
  }
  /**
   * @param {(string)[]} leaves
   */
  insert_many(leaves) {
    const ptr0 = passArrayJsValueToWasm0(leaves, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    wasm.leanimtposeidon_insert_many(this.__wbg_ptr, ptr0, len0)
  }
  /**
   * @param {number} index
   * @param {string} new_leaf
   */
  update(index, new_leaf) {
    const ptr0 = passStringToWasm0(
      new_leaf,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    )
    const len0 = WASM_VECTOR_LEN
    wasm.leanimtposeidon_update(this.__wbg_ptr, index, ptr0, len0)
  }
  /**
   * @param {number} index
   * @returns {(string)[]}
   */
  generate_proof(index) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.leanimtposeidon_generate_proof(retptr, this.__wbg_ptr, index)
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
      var v1 = getArrayJsValueFromWasm0(r0, r1).slice()
      wasm.__wbindgen_free(r0, r1 * 4, 4)
      return v1
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * @param {(string)[]} proof
   * @returns {boolean}
   */
  static verify_proof(proof) {
    const ptr0 = passArrayJsValueToWasm0(proof, wasm.__wbindgen_malloc)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.leanimtposeidon_verify_proof(ptr0, len0)
    return ret !== 0
  }
}

export function __wbindgen_object_drop_ref(arg0) {
  takeObject(arg0)
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1)
  return addHeapObject(ret)
}

export function __wbindgen_string_get(arg0, arg1) {
  const obj = getObject(arg1)
  const ret = typeof obj === "string" ? obj : undefined
  var ptr1 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  var len1 = WASM_VECTOR_LEN
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1))
}
