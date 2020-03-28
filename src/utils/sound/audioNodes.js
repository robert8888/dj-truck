export function nodeChain(nodesArr){
    nodesArr.reduce((prev, current) => {
        prev.connect(current);
        return current;
    })
}