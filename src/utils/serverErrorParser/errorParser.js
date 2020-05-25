export default function parse(errors) {
    let result = "";
    for (let error of errors) {
        if (error.path && error.path instanceof Array) {
            result += "path: " + error.path.join("/") + " -- \n"
        }
        result += ` message: ${error.message} -- code: ${error.extensions.code} ;
        `
    }
    return result;
}