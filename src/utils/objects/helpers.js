export function isEmpty(obj) {
    return (
        obj.constructor === Object &&
        Object.entries(obj).length === 0
    )
}

export function sortObj(obj) {
    if(!(obj instanceof Array)){
        const sorted = {};
        Object.keys(obj).sort(new Intl.Collator("en").compare).forEach(key => {
            sorted[key] = obj[key];
        })
        return sorted;
    } 
    return obj;

}