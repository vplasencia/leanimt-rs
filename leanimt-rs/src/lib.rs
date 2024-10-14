pub struct LeanIMT {
    nodes: Vec<Vec<LeanIMTNode>>,
    hash: LeanIMTHashFunction,
}

pub type LeanIMTNode = String;
pub type LeanIMTHashFunction = fn(Vec<LeanIMTNode>) -> LeanIMTNode;

pub struct LeanIMTMerkleProof {
    pub root: LeanIMTNode,
    pub leaf: LeanIMTNode,
    pub index: usize,
    pub siblings: Vec<LeanIMTNode>,
}

impl LeanIMT {
    pub fn new(
        hash: LeanIMTHashFunction,
        leaves: Vec<LeanIMTNode>,
    ) -> Result<LeanIMT, &'static str> {
        let mut lean_imt = LeanIMT {
            nodes: vec![Vec::new()],
            hash,
        };

        if !leaves.is_empty() {
            lean_imt.insert_many(leaves).unwrap();
        }

        Ok(lean_imt)
    }

    pub fn root(&mut self) -> Option<LeanIMTNode> {
        self.nodes.last().and_then(|level| level.first()).cloned()
    }

    pub fn depth(&self) -> usize {
        self.nodes.len() - 1
    }

    pub fn leaves(&self) -> Vec<LeanIMTNode> {
        self.nodes[0].clone()
    }

    pub fn size(&self) -> usize {
        self.nodes[0].len()
    }

    pub fn index_of(&self, leaf: &LeanIMTNode) -> Option<usize> {
        self.nodes[0].iter().position(|x| x == leaf)
    }

    pub fn has(&self, leaf: &LeanIMTNode) -> bool {
        self.index_of(leaf).is_some()
    }

    pub fn insert(&mut self, leaf: LeanIMTNode) -> Result<(), &'static str> {
        let new_size = self.size() + 1;
        let new_depth = new_size.next_power_of_two().trailing_zeros() as usize;

        if self.depth() < new_depth {
            self.nodes.push(Vec::new());
        }

        let mut node = leaf;
        let mut index = self.size();

        for level in 0..new_depth {
            if self.nodes[level].len() <= index {
                self.nodes[level].push(node.clone());
            } else {
                self.nodes[level][index].clone_from(&node);
            }

            if index & 1 != 0 {
                let sibling = self.nodes[level][index - 1].clone();
                node = (self.hash)(vec![sibling, node]);
            }

            index >>= 1;
        }

        self.nodes[new_depth] = vec![node];

        Ok(())
    }

    pub fn insert_many(&mut self, leaves: Vec<LeanIMTNode>) -> Result<(), &'static str> {
        if leaves.is_empty() {
            return Err("There are no leaves to add");
        }

        let mut start_index = self.size() >> 1;
        self.nodes[0].extend(leaves);

        let new_size = self.size();
        let new_depth = new_size.next_power_of_two().trailing_zeros() as usize;
        let number_of_new_levels = new_depth - self.depth();

        for _ in 0..number_of_new_levels {
            self.nodes.push(Vec::new());
        }

        for level in 0..self.depth() {
            let number_of_nodes = (self.nodes[level].len() as f64 / 2_f64).ceil() as usize;

            for index in start_index..number_of_nodes {
                let left_node = self.nodes[level][index * 2].clone();

                let parent_node = if index * 2 + 1 < self.nodes[level].len() {
                    let right_node = self.nodes[level][index * 2 + 1].clone();
                    (self.hash)(vec![left_node, right_node])
                } else {
                    left_node
                };

                if self.nodes[level + 1].len() <= index {
                    self.nodes[level + 1].push(parent_node);
                } else {
                    self.nodes[level + 1][index] = parent_node;
                }
            }
            start_index >>= 1;
        }

        Ok(())
    }

    pub fn update(&mut self, mut index: usize, new_leaf: LeanIMTNode) -> Result<(), &'static str> {
        let mut node = new_leaf;

        for level in 0..self.depth() {
            self.nodes[level][index].clone_from(&node);

            if index & 1 != 0 {
                let sibling = self.nodes[level][index - 1].clone();
                node = (self.hash)(vec![sibling, node]);
            } else if let Some(sibling) = self.nodes[level].get(index + 1).cloned() {
                node = (self.hash)(vec![node, sibling]);
            }

            index >>= 1;
        }

        let depth = self.depth();

        self.nodes[depth][0] = node;

        Ok(())
    }

    pub fn generate_proof(&self, mut index: usize) -> Result<LeanIMTMerkleProof, &'static str> {
        if index >= self.size() {
            return Err("The leaf does not exist in this tree");
        }

        let leaf = self.leaves()[index].clone();
        let mut siblings = Vec::new();
        let mut path = Vec::new();

        for level in 0..self.depth() {
            let is_right_node = index & 1 != 0;
            let sibling_index = if is_right_node { index - 1 } else { index + 1 };
            if let Some(sibling) = self.nodes[level].get(sibling_index).cloned() {
                path.push(is_right_node);
                siblings.push(sibling);
            }

            index >>= 1;
        }

        let final_index = path
            .iter()
            .rev()
            .fold(0, |acc, &is_right| (acc << 1) | is_right as usize);

        Ok(LeanIMTMerkleProof {
            root: self.nodes[self.depth()][0].clone(),
            leaf,
            index: final_index,
            siblings,
        })
    }
    pub fn verify_proof(
        proof: &LeanIMTMerkleProof,
        hash: LeanIMTHashFunction,
    ) -> Result<bool, &'static str> {
        let mut node = proof.leaf.clone();

        for (i, sibling) in proof.siblings.iter().enumerate() {
            if (proof.index >> i) & 1 != 0 {
                node = hash(vec![sibling.clone(), node]);
            } else {
                node = hash(vec![node, sibling.clone()]);
            }
        }

        Ok(proof.root == node)
    }
}
#[cfg(test)]
mod tests {
    use super::*;

    fn hash_function(nodes: Vec<String>) -> String {
        nodes.join("-")
    }

    #[test]
    fn test_new_tree_with_no_leaves() {
        let leanimt: LeanIMT = LeanIMT::new(hash_function, vec![]).unwrap();
        assert_eq!(leanimt.size(), 0);
        assert_eq!(leanimt.depth(), 0);
    }

    #[test]
    fn test_new_tree_with_leaves() {
        let leanimt: LeanIMT = LeanIMT::new(
            hash_function,
            vec!["1".to_string(), "2".to_string(), "3".to_string()],
        )
        .unwrap();
        assert_eq!(leanimt.size(), 3);
        assert_eq!(leanimt.depth(), 2);
    }

    #[test]
    fn test_index_of() {
        let leaves = vec!["1".to_string(), "2".to_string(), "3".to_string()];
        let leanimt: LeanIMT = LeanIMT::new(hash_function, leaves).unwrap();
        let index = leanimt.index_of(&"2".to_string());
        assert_eq!(index, Some(1));
    }

    #[test]
    fn test_has() {
        let leaves = vec!["1".to_string(), "2".to_string(), "3".to_string()];
        let leanimt: LeanIMT = LeanIMT::new(hash_function, leaves).unwrap();
        let index = leanimt.has(&"2".to_string());
        assert_eq!(index, true);
    }

    #[test]
    fn test_insert_single_leaf() {
        let mut leanimt: LeanIMT = LeanIMT::new(hash_function, vec![]).unwrap();
        leanimt.insert("1".to_string()).unwrap();
        assert_eq!(leanimt.size(), 1);
        assert_eq!(leanimt.depth(), 0);
        assert_eq!(leanimt.root().unwrap(), "1");
    }

    #[test]
    fn test_insert_multiple_leaves() {
        let mut leanimt: LeanIMT = LeanIMT::new(hash_function, vec![]).unwrap();
        leanimt.insert("1".to_string()).unwrap();
        leanimt.insert("2".to_string()).unwrap();
        leanimt.insert("3".to_string()).unwrap();
        leanimt.insert("4".to_string()).unwrap();
        assert_eq!(leanimt.size(), 4);
        assert_eq!(leanimt.depth(), 2);
        assert_eq!(
            leanimt.root().unwrap(),
            hash_function(vec![
                hash_function(vec!["1".to_string(), "2".to_string()]),
                hash_function(vec!["3".to_string(), "4".to_string()])
            ])
        );
    }

    #[test]
    fn test_insert_many_leaves_empty_tree() {
        let mut leanimt: LeanIMT = LeanIMT::new(hash_function, vec![]).unwrap();
        leanimt
            .insert_many(vec![
                "1".to_string(),
                "2".to_string(),
                "3".to_string(),
                "4".to_string(),
            ])
            .unwrap();
        assert_eq!(leanimt.size(), 4);
        assert_eq!(leanimt.depth(), 2);
        assert_eq!(
            leanimt.root().unwrap(),
            hash_function(vec![
                hash_function(vec!["1".to_string(), "2".to_string()]),
                hash_function(vec!["3".to_string(), "4".to_string()])
            ])
        );
    }

    #[test]
    fn test_insert_many_leaves_tree_with_leaves() {
        let mut leanimt: LeanIMT = LeanIMT::new(
            hash_function,
            vec!["1".to_string(), "2".to_string(), "3".to_string()],
        )
        .unwrap();
        leanimt.insert_many(vec!["4".to_string()]).unwrap();

        assert_eq!(leanimt.size(), 4);
        assert_eq!(leanimt.depth(), 2);
        assert_eq!(
            leanimt.root().unwrap(),
            hash_function(vec![
                hash_function(vec!["1".to_string(), "2".to_string()]),
                hash_function(vec!["3".to_string(), "4".to_string()])
            ])
        );
    }

    #[test]
    fn test_insert_many_throw_empty_leaves() {
        let mut leanimt: LeanIMT = LeanIMT::new(hash_function, vec![]).unwrap();
        let result = leanimt.insert_many(vec![]);

        assert!(matches!(result, Err("There are no leaves to add")));
    }

    #[test]
    fn test_update_leaf() {
        let mut leanimt: LeanIMT = LeanIMT::new(
            hash_function,
            vec![
                "1".to_string(),
                "2".to_string(),
                "3".to_string(),
                "4".to_string(),
            ],
        )
        .unwrap();
        leanimt.update(1, "5".to_string()).unwrap();
        assert_eq!(leanimt.size(), 4);
        assert_eq!(
            leanimt.root().unwrap(),
            hash_function(vec![
                hash_function(vec!["1".to_string(), "5".to_string()]),
                hash_function(vec!["3".to_string(), "4".to_string()])
            ])
        );
    }

    #[test]
    fn test_generate_proof() {
        let leanimt: LeanIMT = LeanIMT::new(
            hash_function,
            vec![
                "1".to_string(),
                "2".to_string(),
                "3".to_string(),
                "4".to_string(),
            ],
        )
        .unwrap();
        let proof = leanimt.generate_proof(2).unwrap();

        assert_eq!(
            proof.root,
            hash_function(vec![
                hash_function(vec!["1".to_string(), "2".to_string()]),
                hash_function(vec!["3".to_string(), "4".to_string()])
            ])
        );
        assert_eq!(proof.leaf, "3");
        assert_eq!(proof.index, 2);
        assert_eq!(
            proof.siblings,
            vec!["4", &hash_function(vec!["1".to_string(), "2".to_string()])]
        );
    }

    #[test]
    fn test_generate_proof_throw_incorrect_index() {
        let leanimt: LeanIMT = LeanIMT::new(
            hash_function,
            vec![
                "1".to_string(),
                "2".to_string(),
                "3".to_string(),
                "4".to_string(),
            ],
        )
        .unwrap();
        let proof = leanimt.generate_proof(10);

        assert!(matches!(proof, Err("The leaf does not exist in this tree")));
    }

    #[test]
    fn test_verify_proof() {
        let leanimt: LeanIMT = LeanIMT::new(
            hash_function,
            vec![
                "1".to_string(),
                "2".to_string(),
                "3".to_string(),
                "4".to_string(),
            ],
        )
        .unwrap();
        let proof = leanimt.generate_proof(2).unwrap(); // Generate proof for the third leaf (value 3)
        assert!(LeanIMT::verify_proof(&proof, hash_function).unwrap());
    }
}
