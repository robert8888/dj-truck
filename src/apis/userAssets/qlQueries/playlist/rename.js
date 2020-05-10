export const renameDir = (id, name) => `
    mutation{
        renameDir(id:${id} name:"${name}")
    }
`

export const renamePlaylist = (id, name) => `
    mutation{
        renamePlaylist(id:${id} name:"${name}")
    }
`

export default {
    renameDir,
    renamePlaylist
}