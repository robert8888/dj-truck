export default `
    mutation(
        $id: Int!
        $map: [ControlProfileInput]
    ){
        updateControlProfileMap(id: $id map: $map)
    }
`