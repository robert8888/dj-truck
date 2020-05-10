//-------------user
export {default as myIdQl} from "./user/myId";
// ------------playlist ------
export {default as createDirQl } from "./playlist/createDir";
export {default as createPlaylistQl} from "./playlist/createPlaylist";
export {default as createTrackQl} from "./playlist/createTrack";
export {default as deleteQl} from "./playlist/delete";
export {default as renameQl} from "./playlist/rename";
export {default as loadPlaylistQl} from "./playlist/loadPlaylist";
export {default as loadDirContentQl} from "./playlist/loadDirContent";
export {default as loadRootContentQl} from "./playlist/loadRootDir";
export {default as updateTrackQl} from "./playlist/updateTrack";
export {default as updateTracksPositionsQl} from "./playlist/updateTracksPositions";
export {default as moveQl} from "./playlist/moveElement";

// -------------records -------
export {default as createRecordQl} from "./records/createRecord";
export {default as updateRecordQl} from "./records/updateRecord";
export {default as updateRecordMetaQl} from "./records/updateRecordMeta"
export {default as deleteRecordQl} from "./records/deleteRecord";
export {default as recordsQl} from "./records/getRecords";
export {default as recordQl} from "./records/getRecord";
export {default as createCommentQl} from "./records/createComment";
export {default as updateCommentQl} from "./records/updateComment";
export {default as deleteCommentQl} from "./records/deleteComment";
export {default as addToFavoriteQl} from "./records/favorite/addToFavorite";
export {default as removeFromFavoriteQl} from "./records/favorite/removeFromFavorite";