export const deleteDir = (ids) => `
    mutation{
        deleteDir(ids:[${ids.join(",")}])
    }
`

export const deletePlaylist = (ids) => `
    mutation{
        deletePlaylist(ids:[${ids.join(",")}])
    }
`

export const deleteTrack = (id) => `
    mutation{
        deleteTrack(id: ${id})
    }
`

export default {
    deleteDir,
    deletePlaylist,
    deleteTrack
}