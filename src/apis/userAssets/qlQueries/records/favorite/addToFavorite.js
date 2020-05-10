
export default `
    mutation(
        $recordId: Int!
    ){
        addToFavorite(recordId: $recordId) 
    }
`
