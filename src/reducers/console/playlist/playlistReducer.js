import { ACTIONS } from "actions";
import { produce } from "imer";
import { unset as _unset, set as _set, get as _get } from "lodash/object";
import _isEqual from "lodash/isEqual"
import { findClosesDir, generateTemplateName } from "./utils"

const initState = {
    list: [],

    currentPlaylist: [],// path to play list 
    currentSelection: ['root'], // path to dir or playlist current selected
    root: {}, // root dir for play list 

    renameMode: false,

    //mock
    // root: {
    //     _type: "dir",
    //     "Techno": {
    //         _open: true,
    //         "ZetTempo": {
    //             _type: "playlist",
    //             _content: [],
    //         },
    //         "empty dir": {
    //             _type: "dir"
    //         },
    //         "HardCore": {
    //             _type: "playlist",
    //             _content: [],
    //         },
    //         "Special": {
    //             _type: "dir",
    //             _open: true,
    //             "DubTechno": {
    //                 _type: "playlist",
    //                 _content: [],
    //             },
    //             "Clasic 90": {
    //                 _type: "playlist",
    //                 _content: [],
    //             },
    //         }
    //     },
    //     "Mini mal": {
    //         _type: "dir",
    //         "HighTech": {
    //             _type: "playlist",
    //             _content: [],
    //         },
    //         "Classic": {
    //             _type: "playlist",
    //             _content: [],
    //         },
    //         "EmptyFolder": {
    //             _type: "dir",
    //         },
    //     }
    // }

}

function playListReducer(state = initState, action) {
    switch (action.type) {
        // ------ dir section ---------------------------
        case ACTIONS.PL_PUSH_DIR_CONTENT: {
            const dbDirs = action.dirContent.dirs || [];
            const dbPlaylists = action.dirContent.playlists || [];

            const dirs = {};
            dbDirs.forEach((dir) => {
                dirs[dir.name] = {
                    _type: "dir",
                    _id: dir.id
                }
            })

            const playlists = {};
            dbPlaylists.forEach((pl) => {
                playlists[pl.name] = {
                    _id: pl.id,
                    _type: "playlist",
                    _content: []
                };
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
                    _set(draftState, path, {
                        _id: action.dirContent.dir.id,
                        _type: "dir",
                        _loaded: true,
                        _open: action.open || false,
                        ...dirs,
                        ...playlists
                    })
                })
            }
        }

        case ACTIONS.PL_CREATE_DIR: {
            let { id, name, renameMode } = action;
            const pathToDir = findClosesDir(state, state.currentSelection);
            if (!name) {
                name = generateTemplateName(state, pathToDir, "New folder")
            }
            return produce(state, draftState => {
                _set(draftState, [...pathToDir, name], {
                    _id: id,
                    _type: "dir",
                });
                _set(draftState, [...pathToDir, "_open"], true); // parent
                draftState.currentSelection = [...pathToDir, name];
                if (renameMode) {
                    draftState.renameMode = renameMode;
                }
            })
        }

        case ACTIONS.PL_TOGGLE_DIR: {
            const open = _get(state, [...action.path, "_open"])
            return produce(state, draftState => _set(draftState, [...action.path, "_open"], !open))
        }

        // ------ playlist section -------------------------------   

        case ACTIONS.PL_CREATE_PLAYLIST: {
            let { name, id, renameMode, _setCurrent } = action;
            const pathToDir = findClosesDir(state, state.currentSelection);
            if (!name) {
                name = generateTemplateName(state, pathToDir, "New Playlist")
            }
            return produce(state, draftState => {
                _set(draftState, [...pathToDir, name], {
                    _id: id,
                    _type: "playlist",
                    _content: []
                })
                _set(draftState, [...pathToDir, "_open"], true); // open parent dir
                draftState.currentSelection = [...pathToDir, name]; // _set focus on new element 
                if (_setCurrent) {
                    draftState.currentPlaylist = [...pathToDir, name];
                }
                if (renameMode) {
                    draftState.renameMode = renameMode;
                }
            })
        }

        case ACTIONS.PL_OPEN_CURRENT_PLAY_LIST: {
            return produce(state, draftState => {
                draftState.list = _get(state, [...state.currentSelection, "_content"]);
                draftState.currentPlaylist = state.currentSelection;
            })
        }

        case ACTIONS.PL_SET_PLAYLIST_CONTENT: {
            const tracks = action.playlistContent.tracks;
            tracks.sort((a, b) => a.position - b.position);
            return produce(state, draftState => {
                _set(draftState,
                    [...action.path, "_content"],
                    tracks
                );
            })
        }

        case ACTIONS.PL_RESET_CURRENT_PLAYLIST_CONTETN: {
            return produce(state, draftState => {
                draftState.list = action.list;
                _set(draftState, [...state.currentPlaylist, "_contetnt"], action.list);
            })
        }

        // ---------- selction actions ----------------------

        case ACTIONS.PL_SET_SELECTION: {
            return produce(state, draftState => draftState.currentSelection = action.path)
        }

        // case ACTIONS.PL_SET_CURRENT_PLAYLIST: {
        //     return produce(state, draftState => {
        //         draftState.currentPlayList = action.path;
        //         draftState.list = Array.from(_get(state, [action.path]));
        //     })
        // }

        case ACTIONS.PL_RENAME_SELECTED: {
            const content = _get(state, state.currentSelection);
            return produce(state, draftState => {
                _unset(draftState, state.currentSelection);
                const newCurrent = draftState.currentSelection;
                newCurrent.pop();
                newCurrent.push(action.name);
                draftState.currentSelection = newCurrent;
                _set(draftState, newCurrent, content);
                draftState.renameMode = false;
            })
        }

        case ACTIONS.PL_MOVE_TO: {
            const { pathFrom, pathTo } = action;
            const content = _get(state, pathFrom);
            const name = pathFrom.pop();
            //if tar_get and source are the same don't do anything
            if (pathFrom.length === pathTo.length &&
                pathFrom.every((e, i) => e === pathTo[i])) {
                return state;
            }
            return produce(state, draftState => {
                _set(draftState, [...pathTo, name], content);
                _unset(draftState, [...pathFrom, name]);
                if([...pathFrom, name].join("") === state.currentPlaylist.join("")){
                    draftState.currentPlaylist = [...pathTo, name]; 
                }
            })
        }

        case ACTIONS.PL_DELETE_SELECTED: {
            return produce(state, draftState => {
                _unset(draftState, state.currentSelection);
                draftState.currentSelection = ['root'];
                if(state.currentSelection.every((el, i) => el === state.currentPlaylist[i])){
                    draftState.list  = [];
                }
            })
        }

        //--------------- track actions ------------------

        case ACTIONS.PL_PUSH_TRACK: {
            if (state.currentPlaylist.length === 0 && action.createNew) {
                //if is not seelect any play list - create new
                let pathToDir = ["root"]
                if (state.currentSelection.length > 1) {
                    pathToDir = findClosesDir(state, state.currentSelection);
                }
                const name = generateTemplateName(state, pathToDir, "New Playlist");
                const fullPath = [...pathToDir, name];
                return produce(state, draftState => { // ?? check
                    _set(draftState, fullPath, {
                        _type: "playlist",
                        _content: []
                    })
                    _set(draftState, [...pathToDir, "_open"], true);
                    draftState.currentSelection = fullPath
                    draftState.currentPlaylist = fullPath;
                    const playlist = Array.from(_get(draftState, fullPath));
                    playlist.push(action.track);
                    draftState.list = playlist;
                    _set(draftState, fullPath, playlist);
                })
            }
            return produce(state, draftState => {
                const list = Array.from(draftState.list);
                list.push(action.track)
                draftState.list = list;
                _set(draftState, [...state.currentPlaylist, "_content"], Array.from(draftState.list));
            })
        }

        case ACTIONS.PL_COPY_TRACK_TO_LIST: {
            const list = _get(state, [...action.path, "_content"]);
            if (!list) return state;
            return produce(state, draftState => {
                list.push(action.track);
                _set(draftState, [...action.path, "_content"], list);
            })
        }

        case ACTIONS.PL_SWAP_TRACK_ON_CURRENT: {
            return produce(state, draftState => {
                const newList = [...state.list];
                //swaping
                let trackFrom = newList[action.from];
                newList[action.from] = newList[action.to];
                newList[action.to] = trackFrom;

                draftState.list = newList;
                _set(draftState, [...draftState.currentPlaylist, "_content"], newList)
            })
        }

        case ACTIONS.PL_SET_BPM_AND_OFFSET: {
            let { id, playlist, bpm, off_set } = action;
            let isCurrent = false;
            if (playlist === undefined || playlist.length === 0) {
                isCurrent = true;
                playlist = state.currentPlaylist;
            }
            let list = _get(state, [...playlist, "_content"]) // ?? check
            if (!list) {
                return state;
            }
            list = Array.from(list);
            const index = list.findIndex(track => track.id === id);
            if (index === -1) {
                return state;
            }
            list[index].bpm = bpm;
            if (off_set) {
                list[index].off_set = off_set;
            }
            return produce(state, draftState => {
                _set(draftState, [...playlist, "_content"], list); // ?? check
                if (isCurrent) {
                    draftState.list = list;
                }
                draftState.refreshFalg = Math.random();
            })
        }

        case ACTIONS.PL_DELETE_TRACK: {
            return produce(state, draftState => {
                const newList = [...state.list];
                newList.splice(action.index, 1);
                draftState.list = newList
                _set(draftState, [...draftState.currentPlaylist, "_content"], newList) //?? check
            })
        }

        case ACTIONS.PL_SET_CACHE_STATE: {
            const {playlist, tracks} = action;
            const valueMap = new Map();
            tracks.forEach(track => valueMap.set(track.id, track.cached))
            return produce(state, draftState =>{
                const content = _get(state, [...playlist, "_content"])
                const draftContent = content.map(track => {
                    if(valueMap.has(track.id)){
                        return {
                            ...track,
                            cached: valueMap.get(track.id)
                        }
                    } else {
                        return track
                    }
                })
                if(_isEqual(playlist, state.currentPlaylist)){
                    draftState.list = draftContent
                }
                _set(draftState, [...playlist, "_content"], draftContent)
            })

        }

        case ACTIONS.LOAD_TRACK: {
            const {track: {id}} = action;
            let list = _get(state, [...state.currentPlaylist, "_content"]) // ?? check
            if (!list) {
                return state;
            }
            list = Array.from(list);

            const index = list.findIndex(track => track.id === id);
            if (index === -1) {
                return state;
            }
            list[index].wasLoaded = true;
            return produce(state, draftState => {
                _set(draftState, [...state.currentPlaylist, "_content"], list);
                draftState.list = list;
                draftState.refreshFalg = Math.random();
            })
        }



        default: return state;
    }
}

export default playListReducer;


