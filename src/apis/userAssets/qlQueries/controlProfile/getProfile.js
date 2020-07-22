export default `
    query(
        $id: Int
    ){
        controlProfile(id: $id){
            name
            type
            id
            map {
                key
                value
            }
        } 
    }
`