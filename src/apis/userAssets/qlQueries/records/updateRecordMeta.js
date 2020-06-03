export default  `
    mutation(            
        $id : Int!
        $title: String
        $description: String
        $genres: [String]
        ){
        updateRecord(id: $id input : {
            title: $title
            description: $description
            genres: $genres
        }) 
    }
`