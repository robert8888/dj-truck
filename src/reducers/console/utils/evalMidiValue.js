export const  evalValue = (value, min, max, current) => {
    if(value.match(/^[+-]/)){ //relative +1%
        const diff = (max - min) * (parseFloat(value.substr(1)) /100);
        value = current + ((value.startsWith("+")) ? diff : -diff);
    } else { // absolute  1%
        value = parseInt(value) * (max - min) /100 + min;
    }
    return value;
}

export const toggleValue = (min, max, current) => {
    return (Math.abs(max - current) > Math.abs(current - min)) ? min : max;
}