export default (id) =>`
    query{
        playlist(id: ${id}){
            playlist {
                id
                name
            }
            tracks {
                id
                title
                source
                sourceId
                quality
                duration
                bpm
                offset
                thumbnails
                position
            }
        }
    }
`