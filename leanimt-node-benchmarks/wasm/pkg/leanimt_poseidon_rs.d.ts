/* tslint:disable */
/* eslint-disable */
/**
*/
export class LeanIMTPoseidon {
  free(): void;
/**
* @param {(string)[]} leaves
*/
  constructor(leaves: (string)[]);
/**
* @returns {string | undefined}
*/
  root(): string | undefined;
/**
* @returns {number}
*/
  depth(): number;
/**
* @returns {(string)[]}
*/
  leaves(): (string)[];
/**
* @returns {number}
*/
  size(): number;
/**
* @param {string} leaf
* @returns {number | undefined}
*/
  index_of(leaf: string): number | undefined;
/**
* @param {string} leaf
* @returns {boolean}
*/
  has(leaf: string): boolean;
/**
* @param {string} leaf
*/
  insert(leaf: string): void;
/**
* @param {(string)[]} leaves
*/
  insert_many(leaves: (string)[]): void;
/**
* @param {number} index
* @param {string} new_leaf
*/
  update(index: number, new_leaf: string): void;
/**
* @param {number} index
* @returns {(string)[]}
*/
  generate_proof(index: number): (string)[];
/**
* @param {(string)[]} proof
* @returns {boolean}
*/
  static verify_proof(proof: (string)[]): boolean;
}
