export default  `
    mutation(            
        $id : Int!
        $duration : Float!
        $peaks: [Float]!
        $fileSize: String!
        $tracks: [recordTracksInput]
        ){
        updateRecord(id: $id input : {
            peaks: $peaks
            duration: $duration
            fileSize: $fileSize
            tracks: $tracks
        }) 
    }
`