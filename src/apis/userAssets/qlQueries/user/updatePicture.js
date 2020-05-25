export default `
    mutation(
        $file: Upload!
    ){
        updateMyPicture(file: $file){
            success,
            error,
            message,
            data
        }
    }
        
`