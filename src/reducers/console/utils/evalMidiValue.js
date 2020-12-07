import {toRange} from "utils/math/argRanges";

export const  evalValue = (value, min, max, current) => {
    if(value.match(/^[+-]/)){ //relative +1%
        let diff = parseFloat(value.substr(1));
        if(diff >= 10){ // if more than 10% just jump by one
            return toRange(current += (value.startsWith("+") ? 1 : -1), min , max)
        }
        diff = (max - min) * ((diff) /100);
        value = current + ((value.startsWith("+")) ? diff : -diff);
    } else { // absolute  1%
        value = parseInt(value) * (max - min) /100 + min;
    }
    return value;
}

export const toggleValue = (min, max, current) => {
    return (Math.abs(max - current) > Math.abs(current - min)) ? min : max;
}