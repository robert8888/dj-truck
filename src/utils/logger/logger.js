export const LOG_TYPES = {
    LOG: "Generic log, for login user action",
    DEBUG: "log for debugging purposes",
    WARNING: "log for inform about violation data",
    ERROR: "log contains error information"
}


export class Log{
    constructor(priv, path){
        return Log.Create(LOG_TYPES.LOG, path, priv)
    }

    static Create(type, path, priv, pub, error){
        if(!type){
            type = LOG_TYPES.LOG; 
        }
        return {
            type,
            path,
            message:{
                private: priv,
                public: pub,
            },
            error
        }
    }

    static Error(...args){
        //case 1 - private message
        
        //case 2 - path , private message 
        //      or private message, error object

        //case 3 - path, private message , error object 
        //      or path, private message , public message

        //case 4 - path,  private message, public message, error object

        let path, priv, pub, error; 

        switch(args.length){
            case 1 : {
                if([args[0] instanceof String]){
                    [priv] = args;
                    break;
                } else if(typeof args[0] === "object"){
                    ({path, priv, public: pub, error} = args[0])
                }
                
            }
            case 2: {
                if(args[0] instanceof Array){
                    [path, priv] = args;
                } else if(args[1] instanceof Error){
                    [priv, error] = args;
                }
                break;
            }
            case 3: {
                let third;
                [path , priv, third] = args;

                (third instanceof Error) ?
                    error = third :
                    pub = third;
                
                break;
            }
            case 4: {
                [path, priv, pub, error] = args;
                break;
            }
        }

        return Log.Create(LOG_TYPES.ERROR, path, priv, pub, error)
    }

    static Debug(path, priv){
        if(process.env.NODE_ENV.startsWith('dev')){
            console.group()
            console.log(path)
            (priv instanceof Array) ? console.table(priv) : console.log(priv);
            console.trace();
            console.groupEnd();
        }
        return Log.Create(LOG_TYPES.DEBUG, path, priv)
    }

    static Warning(pub){
        return Log.Create(LOG_TYPES.WARNING, null, pub, pub);
    }
}

export class Logger{

    static instance;
    constructor(store, actions){
        this.store = store;
        this.actions = actions;

        if(!Logger.instance){
            Logger.instance = this;
        }
        return Logger.instance;
    }  

    static push(log){
        const logger = Logger.instance;
        if(!logger.store || !logger.actions || !logger.actions.push){
            throw new Error("Logger not configured");
        }
        logger.store.dispatch(
            logger.actions.push(log)
        )
    }
}
