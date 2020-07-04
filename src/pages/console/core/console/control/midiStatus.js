const MIDI_STATUS = {
    NOTE_ON : "Note on",
    NOTE_OFF : "Note off",
    POLYPHONIC_AFTER_TOUCHE: "Polyphonic after touch",
    CONTROL_CHANGE: "Control change CC",
    PROGRAM_CHANGE: "Program change",
    CHANNEL_AFTER_TOUCHE : "Channel after touche",
    PITCH_WHEEL_RANGE: "Pitch wheel range",
    SYSTEM_EXCLUSIVE: "System exclusive",
    SYSTEM_COMMON : "System common",
    SONG_POSITION_POINTER: "Song Position Pointer",
    SONG_SELECT: "Song Select",
    TIMING_CLOCK: "timing clock",
    START: "start",
    CONTINUE: "continue",
    STOP: "stop",
    ACTIVE_SENSING: "active sensing",
    RESET: "sys reset",

}

export default class MidiStatus {
    constructor() {
    }

    translate(msg){

    }

    getStatus(code){
        if(code >= 128 && code <=143){
            return {
                status: MIDI_STATUS.NOTE_OFF,
                channel: code - 127,
            }
        } else if( code >= 144 && code <= 159){
            return {
                status: MIDI_STATUS.NOTE_ON,
                channel: code - 143,
            }
        } else if( code >= 160 && code <= 175){
            return {
                status: MIDI_STATUS.POLYPHONIC_AFTER_TOUCHE,
                channel: code - 159,
            }
        } else if( code >= 176 && code <= 191){
            return {
                status: MIDI_STATUS.CONTROL_CHANGE,
                channel: code - 175,
            }
        } else if( code >= 192 && code <= 207){
            return {
                status: MIDI_STATUS.PROGRAM_CHANGE,
                channel: code - 191,
            }
        } else if( code >= 208 && code <= 223){
            return {
                status: MIDI_STATUS.PROGRAM_CHANGE,
                channel: code - 207,
            }
        } else if( code >= 224 && code <= 239){
            return {
                status: MIDI_STATUS.PITCH_WHEEL_RANGE,
                channel: code - 223,
            }
        }else if( code === 240){
            return {
                status: MIDI_STATUS.SYSTEM_EXCLUSIVE,
            }
        }else if( code === 242){
            return {
                status: MIDI_STATUS.SONG_POSITION_POINTER,
            }
        }else if( code === 243){
            return {
                status: MIDI_STATUS.SONG_SELECT,
            }
        } else if([241, 244, 245].includes(code)){
            return {
                status: MIDI_STATUS.SYSTEM_COMMON,
            }
        }else if( code === 248){
            return {
                status: MIDI_STATUS.TIMING_CLOCK,
            }
        }else if( code === 250){
            return {
                status: MIDI_STATUS.START,
            }
        }else if( code === 251){
            return {
                status: MIDI_STATUS.CONTINUE,
            }
        }else if( code === 252){
            return {
                status: MIDI_STATUS.STOP,
            }
        }else if( code === 254){
            return {
                status: MIDI_STATUS.ACTIVE_SENSING,
            }
        }else if( code === 255){
            return {
                status: MIDI_STATUS.RESET,
            }
        }
    }
}