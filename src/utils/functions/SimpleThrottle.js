/* this throttling function don't memorize calls so it only prevent to fast call */

export default function SimpleThrottle(callback , time){
    const that = this;
    let lastCall = null;
    return function (...args){
        if(!lastCall || performance.now() - lastCall > time){
            lastCall = performance.now();
            callback.apply(that, args);
        }
    }
}