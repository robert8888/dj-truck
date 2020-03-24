export function inRange(value, min, max){
    return (value <= max && value >= min) 
}

export function toRange(value, min, max){
    value = Math.max(value, min);
    return Math.min(value, max);
}