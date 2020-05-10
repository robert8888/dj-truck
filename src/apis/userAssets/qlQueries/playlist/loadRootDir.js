export default `
    query {
        root {
            dir{
                id
                name
            }
                dirs {
                name
                id
            }
            playlists {
                name
                id
            }
        }
    }
`