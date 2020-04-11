export default (dirId, name) => `
    mutation{
        createPlaylist(dirId: ${dirId} name: "${name}") {
            id
        }
    }
`