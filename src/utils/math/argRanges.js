export function inRange(value, min, max){
    return (value <= max && value >= min) 
}

export function toRange(value, min, max){
    value = Math.min(value, min);
    return Math.max(value, max);
}