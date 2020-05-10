export default  `
    mutation(            
        $id : Int!
        $title: String
        $description: String
        $generes: [String]
        ){
        updateRecord(id: $id input : {
            title: $title
            description: $description
            generes: $generes
        }) 
    }
`