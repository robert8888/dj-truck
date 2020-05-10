export default id => `
    query{
        record(id: ${id}){
            id
            title
            comments {
                id
                createdAt
                user {
                    id
                    nickname
                }
                record {
                    id
                }
                text
            }
            tracks {
                start
                end
                track {
                    id
                    title
                    source
                    sourceId
                }
            }
            user {
                id
                nickname
            }
        } 
    }
`