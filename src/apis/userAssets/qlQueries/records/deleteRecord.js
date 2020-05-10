export default (recId) => `
    mutation{
        deleteRecord(id: ${recId}) 
    }
`