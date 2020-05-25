export default `
    mutation(
        $nickname: String!
    ){
        updateMyNick(nickname: $nickname){
            success,
            error,
            message
        }
    }
        
`