

export default function useRecordSearchUrl(){
    const getUrl = (queryStr, opt) =>{
        let params = "";
        const {searchOpt, searchParams} = opt; 

        params = "";
        for (let optName in searchOpt) {
            if (!searchOpt[optName]) {
                params += 'no-' + optName + ',';
            }
        }
        if (params.length > 1) {
            params = "&searchOpt=" + params
            params = params.substr(0, params.length - 1)
        }

        const search = [];
        for(let paramName in searchParams){
            const value =  searchParams[paramName];
            switch(typeof value){
                case "boolean": {
                    search.push(paramName + "=" + value.toString())
                    break; 
                }
                case "string" : {
                    search.push(paramName + '=' + value)
                    break;
                }
                case "object" :{
                    if(value instanceof Array && value.length && value.some( item => (item))){
                        search.push( paramName + "=" + value.join(","));
                    }
                    break;
                }
                default: return null;
            } 
        }
        
        if(search.length){
            if(!params) {
                params += "?"
            } 
            params += search.join("&")
        }

        return '/records?search=' + queryStr + params;
    }

    return [getUrl];
}