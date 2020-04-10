export default (parrentId, name) => `
    mutation{
        createDir(parrentId: ${parrentId} name: "${name}") {
            id
        }
    }
`