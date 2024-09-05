/* tslint:disable */
/* eslint-disable */
/**
 */
export class LeanIMTPoseidon {
  free(): void
  /**
   * @param {(string)[]} leaves
   */
  constructor(leaves: string[])
  /**
   * @returns {string | undefined}
   */
  root(): string | undefined
  /**
   * @returns {number}
   */
  depth(): number
  /**
   * @returns {(string)[]}
   */
  leaves(): string[]
  /**
   * @returns {number}
   */
  size(): number
  /**
   * @param {string} leaf
   * @returns {number | undefined}
   */
  index_of(leaf: string): number | undefined
  /**
   * @param {string} leaf
   * @returns {boolean}
   */
  has(leaf: string): boolean
  /**
   * @param {string} leaf
   */
  insert(leaf: string): void
  /**
   * @param {(string)[]} leaves
   */
  insert_many(leaves: string[]): void
  /**
   * @param {number} index
   * @param {string} new_leaf
   */
  update(index: number, new_leaf: string): void
  /**
   * @param {number} index
   * @returns {(string)[]}
   */
  generate_proof(index: number): string[]
  /**
   * @param {(string)[]} proof
   * @returns {boolean}
   */
  static verify_proof(proof: string[]): boolean
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_leanimtposeidon_free: (a: number, b: number) => void
  readonly leanimtposeidon_new: (a: number, b: number) => number
  readonly leanimtposeidon_root: (a: number, b: number) => void
  readonly leanimtposeidon_depth: (a: number) => number
  readonly leanimtposeidon_leaves: (a: number, b: number) => void
  readonly leanimtposeidon_size: (a: number) => number
  readonly leanimtposeidon_index_of: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => void
  readonly leanimtposeidon_has: (a: number, b: number, c: number) => number
  readonly leanimtposeidon_insert: (a: number, b: number, c: number) => void
  readonly leanimtposeidon_insert_many: (
    a: number,
    b: number,
    c: number
  ) => void
  readonly leanimtposeidon_update: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => void
  readonly leanimtposeidon_generate_proof: (
    a: number,
    b: number,
    c: number
  ) => void
  readonly leanimtposeidon_verify_proof: (a: number, b: number) => number
  readonly __wbindgen_malloc: (a: number, b: number) => number
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => number
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number
  readonly __wbindgen_free: (a: number, b: number, c: number) => void
}

export type SyncInitInput = BufferSource | WebAssembly.Module
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput
): InitOutput

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>
): Promise<InitOutput>
