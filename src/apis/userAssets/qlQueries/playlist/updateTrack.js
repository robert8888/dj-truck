export default `
    mutation(
        $id: Int!
        $bpm: Float
        $offset: Float
        $position: Int
        $playlist: Int
    ) {
        updateTrack(id: $id input:{
            bpm: $bpm
            offset: $offset
            position: $position
            playlist: $playlist
        })
    }
`