import { ACTIONS } from "../actions";
import { produce } from "imer";
import { unset, set, get } from "lodash/object"

const initState = {
    list: [],

    currentPlaylist: [],// path to play list 
    currentSelection: ['root'], // path to dir or playlist current selected
    root: {}, // root dir for play list 

    //mock
    root: {
        "Techno": {
            _open: true,
            "ZetTempo": [],
            "empty dir": {},
            "HardCore": [],
            "Special": {
                _open: true,
                "DubTechno": [],
                "Clasic 90": []
            }
        },
        "Mini mal": {
            "HighTech": [],
            "Classic": [],
            "EmptyFolder": {}
        }
    }
}

function playListReducer(state = initState, action) {
    switch (action.type) {
        case ACTIONS.PUSH_TRACK: {
            if (state.currentPlaylist.length === 0) {
                //if is not seelect any play list - create new
                let pathToDir = ["root"]
                if (state.currentSelection.length > 1) {
                    pathToDir = findClosesDir(state, state.currentSelection);
                }
                const name = generateTemplateName(state, pathToDir, "New Playlist");
                const fullPath = [...pathToDir, name];
                return produce(state, draftState => {
                    set(draftState, fullPath, [])
                    set(draftState, [...pathToDir, "_open"], true);
                    draftState.currentSelection = fullPath
                    draftState.currentPlaylist = fullPath;
                    const playlist = Array.from(get(draftState, fullPath));
                    playlist.push(action.track);
                    draftState.list = playlist;
                    set(draftState, fullPath, playlist);
                })
            }
            return produce(state, draftState => {
                const list = Array.from(draftState.list);
                list.push(action.track)
                draftState.list = list;
                set(draftState, state.currentPlaylist, Array.from(draftState.list));
            })
        }

        case ACTIONS.SET_BPM_AND_OFFSET: {
            let { id, playlist, bpm, offset } = action;
            let isCurrent = false;
            if (playlist === undefined || playlist.length === 0){
                isCurrent = true;
                playlist = state.currentPlaylist;
            }
            const list = Array.from(get(state, playlist));
            const index = list.findIndex(element => element._id === id);
            if(index === -1){
                return state;
            }
            list[index].bpm = bpm;
            if(offset){
                list[index].offset = offset;
            }
            return produce(state, draftState => {
                set(draftState, playlist, list);
                if(isCurrent){
                    draftState.list = list;
                }
                draftState.refreshFalg = Math.random();
            })
        }
        case ACTIONS.PL_TOGGLE_DIR: {
            const open = get(state, [...action.path, "_open"])
            return produce(state, draftState => set(draftState, [...action.path, "_open"], !open))
        }
        case ACTIONS.PL_SET_SELECTION: {
            return produce(state, draftState => draftState.currentSelection = action.path)
        }

        case ACTIONS.PL_SET_CURRENT_PLAYLIST: {
            return produce(state, draftState => {
                draftState.currentPlayList = action.path;
                draftState.list = Array.from(get(state, [action.path]));
            })
        }

        case ACTIONS.PL_RENAME_SELECTED: {
            const content = get(state, state.currentSelection);
            return produce(state, draftState => {
                unset(draftState, state.currentSelection);
                const newCurrent = draftState.currentSelection;
                newCurrent.pop();
                newCurrent.push(action.name);
                draftState.currentSelection = newCurrent;
                set(draftState, newCurrent, content)
            })
        }

        case ACTIONS.PL_DELETE_SELECTED: {
            return produce(state, draftState => {
                unset(draftState, state.currentSelection);
                draftState.currentSelection = [];
            })
        }

        case ACTIONS.PL_MOVE_TO: {
            const { pathFrom, pathTo } = action;
            const content = get(state, pathFrom);
            const name = pathFrom.pop();
            //if target and source are the same don't do anything
            if (pathFrom.length === pathTo.length &&
                pathFrom.every((e, i) => e === pathTo[i])) {
                return state;
            }
            return produce(state, draftState => {
                set(draftState, [...pathTo, name], content);
                unset(draftState, [...pathFrom, name]);
            })
        }

        case ACTIONS.PL_DELETE_TRACK: {
            return produce(state, draftState => {
                const newList = [...state.list];
                newList.splice(action.index, 1);
                draftState.list = newList
                set(draftState, draftState.currentPlaylist, newList)
            })
        }

        case ACTIONS.PL_SWAP_TRACK_ON_CURRENT: {
            return produce(state, draftState => {
                const newList = [...state.list];
                let trackFrom = newList[action.from];
                newList[action.from] = newList[action.to];
                newList[action.to] = trackFrom;
                draftState.list = newList;
                set(draftState, draftState.currentPlaylist, newList)
            })
        }

        case ACTIONS.PL_ADD_TRACK_TO_LIST: {
            const list = get(state, action.path);
            if (!list) return state;
            return produce(state, draftState => {
                list.push(action.track);
                set(draftState, action.fullPath, list);
            })
        }

        case ACTIONS.PL_CREATE_DIR: {
            console.log(action.name)
            let name = action.name;
            const pathToDir = findClosesDir(state, state.currentSelection);
            if (!name) {
                name = generateTemplateName(state, pathToDir, "New Folder");
                console.log("new name", name)
            }
            return produce(state, draftState => {
                set(draftState, [...pathToDir, name], {})
                set(draftState, [...pathToDir, "_open"], true);
                draftState.currentSelection = [...pathToDir, name];
            })
        }

        case ACTIONS.PL_CREATE_PLAYLIST: {
            let name = action.name;
            const pathToDir = findClosesDir(state, state.currentSelection);
            if (!name) {
                name = generateTemplateName(state, pathToDir, "New Playlist");
            }
            return produce(state, draftState => {
                set(draftState, [...pathToDir, name], [])
                set(draftState, [...pathToDir, "_open"], true);
                draftState.currentSelection = [...pathToDir, name];
            })
        }

        case ACTIONS.PL_OPEN_CURRENT_PLAY_LIST: {
            return produce(state, draftState => {
                draftState.list = Array.from(get(state, state.currentSelection))
                draftState.currentPlaylist = state.currentSelection;
            })
        }


        default: return state;
    }
}

export default playListReducer;


function findClosesDir(state, path) {
    if (get(state, path) instanceof Array) {
        path.pop();
        return findClosesDir(state, path)
    } else return path;
}

function generateTemplateName(state, path, base) {
    let i = 0;
    while (true) {
        const number = i || "";
        let name = base + " " + number;
        const notExist = !(get(state, [...path, name]));
        if (notExist) {
            return name;
        } else {
            i++;
        }
    }
}