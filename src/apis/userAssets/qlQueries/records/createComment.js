export default  `
    mutation(            
        $userId : Int!
        $recordId : Int!
        $text: String!
        $time: Float!
        ){
        createComment(input : {
            userId: $userId
            recordId: $recordId
            text: $text
            time: $time
        }) {
            id
            user {
                id
                nickname
            }
            record {
                id
            }
            time 
            text
            createdAt
        }
    }
`