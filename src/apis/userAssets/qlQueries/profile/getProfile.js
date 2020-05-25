export default `
    query(
        $nickname: String!
    ){
        profile(nickname: $nickname){
            user{
                id,
                nickname
                picture
                createdAt
            }
            description
            records
            recordsTime
            generes {
                occurrence
                genere {
                    name
                }
            }
        }
    }
        
`