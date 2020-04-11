export const moveDir = (id, target) => `
    mutation{
        moveDir(id: ${id} targetId: ${target})
    }
`

export const movePlaylist = (id, target) => `
    mutation{
        movePlaylist(id: ${id} targetId: ${target})
    }
`


export default {
    moveDir,
    movePlaylist,
}