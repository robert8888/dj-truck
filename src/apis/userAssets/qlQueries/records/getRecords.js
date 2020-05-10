export default `
    query(
        $userId: Int
        $nickname: String
        $pageSize: Int!
        $page: Int!
        $genereNames: [String]
        $title: String
        $id: Int
        $query: String
        $queryOpt: [String]
    ){
        records(input : {
            userId: $userId
            nickname: $nickname
            title: $title
            id: $id
            genereNames: $genereNames
            query: $query
            queryOpt: $queryOpt
            pagin: {
                pageSize: $pageSize
                page: $page
            }
        }){
            records {
                id
                title
                description
                createdAt,
                generes  {
                    name
                }
                user {
                    id
                    nickname
                }
                peaks
                duration
                fileSize 
                favorited
            }
            countAll
        } 
    }
`