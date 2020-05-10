export default (recName) => `
    mutation{
        createRecord(title: "${recName}") {
            id
        }
    }
`