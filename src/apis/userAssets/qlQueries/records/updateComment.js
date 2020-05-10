export default  `
    mutation(            
        $commentId : Int!
        $text : String!
        ){
        updateComment(input : {
            commentId : $commentId
            text: $text
        }) 
    }
`