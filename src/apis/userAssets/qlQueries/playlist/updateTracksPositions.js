export default `
    mutation (
        $tracksPositions: [tracksPositions]!
    ) {
        updateTracksPositions(input: $tracksPositions)
    }
`