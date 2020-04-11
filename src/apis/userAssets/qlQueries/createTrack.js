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

// export default data => `
//     mutation{
//         createTrack(input : {
//             playlist: ${data.playlist}
//             title: "${data.title}"
//             source: "${data.source}"
//             sourceId: "${data.sourceId}"
//             quality: "${data.quality}"
//             duration: ${data.duration}
//             thumbanils: "${data.thumbnails}"
//             position: ${data.position}
//         }) {
//             id
//         }
//     }
// `
