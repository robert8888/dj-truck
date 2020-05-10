export default  `
    mutation(            
        $playlist : Int!
        $title : String!
        $source: String!
        $sourceId : String!
        $quality: String
        $duration: Float!
        $thumbnails: JSON
        $bpm: Float
        $offset: Float
        $position: Int!
        ){
        createTrack(input : {
            playlist: $playlist,
            title: $title,
            source: $source,
            sourceId: $sourceId,
            quality: $quality
            duration: $duration
            bpm: $bpm
            offset: $offset
            thumbnails: $thumbnails
            position: $position
        }) {
            id
        }
    }
`


