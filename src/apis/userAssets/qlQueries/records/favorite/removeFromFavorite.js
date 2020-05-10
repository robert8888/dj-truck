
export default `
mutation(
    $recordId: Int!
){
    removeFavorite(recordId: $recordId) 
}
`