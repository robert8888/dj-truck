import { get } from "lodash/object";

export function findClosesDir(state, [...path]) {
    if (get(state, path) instanceof Array || get(state, path)?._type === "playlist") {
        path.pop();
        return findClosesDir(state, path)
    } else return path;
}

export function generateTemplateName(state, [...pathToDir], base) {
    let i = 0;
    while (true) {
        const number = i ? " " + i : "";
        let name = base + number;
        const notExist = !(get(state, [...pathToDir, name]));
        if (notExist) {
            return name;
        } else {
            i++;
        }
    }
}