export default (id) =>`
    query{
        dir(id: ${id}){
            dir {
                id
                name
            }
            dirs {
                id
                name
            }
            playlists {
                id
                name
            }
        }
    }
`