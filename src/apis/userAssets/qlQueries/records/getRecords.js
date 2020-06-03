export default `
    query(
        $userId: Int
        $nickname: String
        $pageSize: Int!
        $page: Int!
        $genreNames: [String]
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
            genreNames: $genreNames
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
                genres  {
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