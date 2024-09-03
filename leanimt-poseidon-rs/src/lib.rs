use ark_bn254::Fr;
use ark_ff::PrimeField;
use leanimt_rs::*;
use light_poseidon::{Poseidon, PoseidonHasher};
use wasm_bindgen::prelude::*;

fn poseidon_function(nodes: Vec<String>) -> String {
    let mut poseidon = Poseidon::<Fr>::new_circom(2).unwrap();

    let input1 = Fr::from_be_bytes_mod_order(nodes[0].as_bytes());
    let input2 = Fr::from_be_bytes_mod_order(nodes[1].as_bytes());

    let hash = poseidon.hash(&[input1, input2]).unwrap();

    return hash.to_string();
}

#[wasm_bindgen]
pub struct LeanIMTPoseidon {
    leanimt: LeanIMT,
}

#[wasm_bindgen]
impl LeanIMTPoseidon {
    #[wasm_bindgen(constructor)]
    pub fn new(leaves: Vec<LeanIMTNode>) -> LeanIMTPoseidon {
        let imt_poseidon = LeanIMTPoseidon {
            leanimt: LeanIMT::new(poseidon_function, leaves).unwrap(),
        };

        return imt_poseidon;
    }

    pub fn root(&mut self) -> Option<LeanIMTNode> {
        self.leanimt.root()
    }

    pub fn depth(&self) -> usize {
        self.leanimt.depth()
    }

    pub fn leaves(&self) -> Vec<LeanIMTNode> {
        self.leanimt.leaves()
    }

    pub fn size(&self) -> usize {
        self.leanimt.size()
    }

    pub fn index_of(&self, leaf: LeanIMTNode) -> Option<usize> {
        self.leanimt.index_of(&leaf)
    }

    pub fn has(&self, leaf: LeanIMTNode) -> bool {
        self.leanimt.has(&leaf)
    }

    pub fn insert(&mut self, leaf: LeanIMTNode) -> () {
        match self.leanimt.insert(leaf) {
            Ok(()) => (),
            Err(_) => panic!("Failed to insert a the leaf"),
        }
    }

    pub fn insert_many(&mut self, leaves: Vec<LeanIMTNode>) -> () {
        match self.leanimt.insert_many(leaves) {
            Ok(()) => (),
            Err(_) => panic!("Failed to insert a the leaf"),
        }
    }

    pub fn update(&mut self, index: usize, new_leaf: LeanIMTNode) -> () {
        match self.leanimt.update(index, new_leaf) {
            Ok(()) => (),
            Err(_) => panic!("Failed to update the leaf"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash() {
        let mut a: Vec<String> = Vec::new();

        a.push("1".to_string());
        a.push("2".to_string());

        let result = poseidon_function(a);

        println!("{result}");

        assert_eq!(result, result);
    }
}
