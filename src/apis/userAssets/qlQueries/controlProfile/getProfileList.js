export default `
    query(
        $userId: Int
    ){
        controlProfileList(userId: $userId){
            name
            type
            id
        } 
    }
`