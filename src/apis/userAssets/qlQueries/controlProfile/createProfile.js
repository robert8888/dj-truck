export default `
    mutation(
        $name: String!
        $type: String!
    ){
        createControlProfile(name: $name type: $type){
            id
            name,
            type,
        } 
    }
`