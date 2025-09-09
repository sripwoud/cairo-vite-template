fn is_over_eighteen(age: u32) -> bool {
    age > 18
}

#[executable]
fn main(age: u32) -> bool {
    is_over_eighteen(age)
}


#[cfg(test)]
mod tests {
    use super::is_over_eighteen;

    #[test]
    fn it_is_true_if_over_eighteen() {
        assert!(is_over_eighteen(19));
    }

    #[test]
    fn it_is_false_if_under_eighteen() {
        assert!(!is_over_eighteen(17));
    }
}
