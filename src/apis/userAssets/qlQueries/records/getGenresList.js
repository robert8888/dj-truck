export default `
    query(
        $limit: Int
    ){
        genres(limit: $limit){
            id
            name
        } 
    }
`