export default `
    mutation(
        $description: String!
    ){
        udpateMyDescription(description: $description) {
            success,
            error,
            message,
        }
    }
        
`