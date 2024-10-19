use ark_bn254::Fr;
use leanimt_rs::*;
use light_poseidon::{Poseidon, PoseidonHasher};
use num_bigint::BigUint;
use wasm_bindgen::prelude::*;

fn string_to_biguint(num_str: &str) -> BigUint {
    num_str
        .parse()
        .expect("Failed to parse the string into BigUint")
}

fn poseidon_function(nodes: Vec<String>) -> String {
    let mut poseidon = Poseidon::<Fr>::new_circom(2).unwrap();

    let input1 = Fr::from(string_to_biguint(&nodes[0]));
    let input2 = Fr::from(string_to_biguint(&nodes[1]));

    let hash = poseidon.hash(&[input1, input2]).unwrap();

    hash.to_string()
}

#[wasm_bindgen]
pub struct LeanIMTPoseidon {
    leanimt: LeanIMT,
}

#[wasm_bindgen]
impl LeanIMTPoseidon {
    #[wasm_bindgen(constructor)]
    pub fn new(leaves: Vec<LeanIMTNode>) -> LeanIMTPoseidon {
        LeanIMTPoseidon {
            leanimt: LeanIMT::new(poseidon_function, leaves).unwrap(),
        }
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

    pub fn insert(&mut self, leaf: LeanIMTNode) {
        match self.leanimt.insert(leaf) {
            Ok(()) => (),
            Err(_) => panic!("Failed to insert the leaf"),
        }
    }

    pub fn insert_many(&mut self, leaves: Vec<LeanIMTNode>) {
        match self.leanimt.insert_many(leaves) {
            Ok(()) => (),
            Err(_) => panic!("Failed to insert the leaves"),
        }
    }

    pub fn update(&mut self, index: usize, new_leaf: LeanIMTNode) {
        match self.leanimt.update(index, new_leaf) {
            Ok(()) => (),
            Err(_) => panic!("Failed to update the leaf"),
        }
    }

    pub fn generate_proof(&mut self, index: usize) -> Vec<String> {
        match self.leanimt.generate_proof(index) {
            Ok(proof) => vec![
                proof.root,
                proof.leaf,
                proof.index.to_string(),
                proof.siblings.join(","),
            ],
            Err(_) => panic!("Failed to generate the proof"),
        }
    }

    pub fn verify_proof(proof: Vec<String>) -> bool {
        let siblings: Vec<String> = if !proof[3].is_empty() {
            // If proof[3] is not empty, split it by commas and convert it to Vec<String>
            proof[3].clone().split(',').map(|s| s.to_string()).collect()
        } else {
            // If proof[3] is empty, return an empty Vec<String>
            Vec::new()
        };

        let temp = LeanIMTMerkleProof {
            root: proof[0].clone(),
            leaf: proof[1].clone(),
            index: proof[2].parse().unwrap(),
            siblings,
        };
        LeanIMT::verify_proof(&temp, poseidon_function).unwrap()
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

    #[test]
    fn test_generate_proof() {
        let mut tree = LeanIMTPoseidon::new(vec![
            "1".to_string(),
            "2".to_string(),
            "3".to_string(),
            "4".to_string(),
        ]);
        let proof = tree.generate_proof(2);

        println!("{:?}", proof);

        assert_eq!(
            proof[0],
            poseidon_function(vec![
                poseidon_function(vec!["1".to_string(), "2".to_string()]),
                poseidon_function(vec!["3".to_string(), "4".to_string()])
            ])
        );
        assert_eq!(proof[1], "3".to_string());
        assert_eq!(proof[2], "2");
        assert_eq!(
            proof[3],
            vec![
                "4",
                &poseidon_function(vec!["1".to_string(), "2".to_string()])
            ]
            .join(",")
        );
    }
    #[test]
    fn test_verify_proof() {
        let mut tree = LeanIMTPoseidon::new(vec![
            "1".to_string(),
            "2".to_string(),
            "3".to_string(),
            "4".to_string(),
        ]);
        let proof = tree.generate_proof(2);

        assert!(LeanIMTPoseidon::verify_proof(proof));
    }

    #[test]
    fn test_verify_proof_tree_size_one() {
        let mut tree = LeanIMTPoseidon::new(vec!["1".to_string()]);
        let proof = tree.generate_proof(0);

        assert!(LeanIMTPoseidon::verify_proof(proof));
    }
}
