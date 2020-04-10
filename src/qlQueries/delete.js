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