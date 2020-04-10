import { ACTIONS } from "../../../actions";
import { produce } from "imer";
import { unset, set, get } from "lodash/object";
import { findClosesDir, generateTemplateName } from "./utils"

const initState = {
    list: [],

    currentPlaylist: [],// path to play list 
    currentSelection: ['root'], // path to dir or playlist current selected
    root: {}, // root dir for play list 

    renameMode : false,
    
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
        //done
        case ACTIONS.PL_PUSH_DIR_CONTENT: {
            const dbDirs = action.dirContent.dirs || [];
            const dbPlaylists = action.dirContent.playlists || [];
            
            const dirs = {};
            dbDirs.map((dir) => {
                dirs[dir.name] = { _id: dir.id }
            })
            
            const playlists = {};
            dbPlaylists.map((pl) => {
                let newPlaylist = [];
                newPlaylist._id = pl.id;
                playlists[pl.name] = newPlaylist;
            })
           
            if (action.isRoot) {
                return {
                    ...state,
                    root: {
                        _id: action.dirContent.dir.id,
                        ...dirs,
                        ...playlists,
                    }
                }
            } else {
                const path = action.path;
                return produce(state, draftState => {
                    set(draftState, path , {
                        _id: action.dirContent.dir.id,
                        _loaded: true,
                        _open: action.open || false,
                        ...dirs,
                        ...playlists
                    })
                })
            }
        }



        case ACTIONS.PUSH_TRACK: {
            if (state.currentPlaylist.length === 0 && action.createNew) {
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
          //  console.log("Set bpm and offset", id, playlist, bpm, offset);
            let isCurrent = false;
            if (playlist === undefined || playlist.length === 0) {
                isCurrent = true;
                playlist = state.currentPlaylist;
            }
            let list = get(state, playlist)
            if(!list){
                return state;
            }
            list = Array.from(list);
            const index = list.findIndex(element => element.id === id);
            if (index === -1) {
                return state;
            }
            list[index].bpm = bpm;
            if (offset) {
                list[index].offset = offset;
            }
            return produce(state, draftState => {
                set(draftState, playlist, list);
                if (isCurrent) {
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

        //done
        case ACTIONS.PL_RENAME_SELECTED: {
            const content = get(state, state.currentSelection);
            return produce(state, draftState => {
                unset(draftState, state.currentSelection);
                const newCurrent = draftState.currentSelection;
                newCurrent.pop();
                newCurrent.push(action.name);
                draftState.currentSelection = newCurrent;
                set(draftState, newCurrent, content);
                draftState.renameMode = false;
            })
        }

        case ACTIONS.PL_DELETE_SELECTED: {
            return produce(state, draftState => {
                unset(draftState, state.currentSelection);
                draftState.currentSelection = ['root'];
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


        //done
        case ACTIONS.PL_CREATE_DIR: {
            const { id, name, renameMode } = action;
            const pathToDir = findClosesDir(state, state.currentSelection);
            return produce(state, draftState => {
                set(draftState, [...pathToDir, name], { _id: id });
                set(draftState, [...pathToDir, "_open"], true);
                draftState.currentSelection = [...pathToDir, name];
                if(renameMode){
                    draftState.renameMode = renameMode;
                }
            })
        }

        //done
        case ACTIONS.PL_CREATE_PLAYLIST: {
            const {name, id , renameMode, setCurrent} = action;
           // console.log("creating playlist reducer", name, id, renameMode);
            const pathToDir = findClosesDir(state, state.currentSelection);
            return produce(state, draftState => {
                const newPlaylist = [];
                newPlaylist._id = id;
                set(draftState, [...pathToDir, name], newPlaylist)
                set(draftState, [...pathToDir, "_open"], true);
                draftState.currentSelection = [...pathToDir, name];
                if(setCurrent){
                    draftState.currentPlaylist = [...pathToDir, name];
                }
                if(renameMode){
                    draftState.renameMode = renameMode;
                }
            })


        }

        case ACTIONS.PL_OPEN_CURRENT_PLAY_LIST: {
            return produce(state, draftState => {
                draftState.list = get(state, state.currentSelection);
                draftState.currentPlaylist = state.currentSelection;
            })
        }


        default: return state;
    }
}

export default playListReducer;


