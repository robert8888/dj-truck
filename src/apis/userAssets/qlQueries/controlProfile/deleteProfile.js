export default `
    mutation(
        $id: Int!
    ){
        deleteControlProfile(id: $id)
    }
`