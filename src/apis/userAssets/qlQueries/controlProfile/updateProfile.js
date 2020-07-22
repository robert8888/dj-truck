export default `
    mutation(
        $id: Int!
        $name: String
        $type: String
    ){
        updateControlProfile(input: {
            id: $id
            name: $name
            type: $type
        }) {
            name
            id
        }
    }
`