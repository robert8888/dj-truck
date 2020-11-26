import React, { useContext, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Spin } from "react-loading-io";
import { formater } from "./../../../../../../utils/time/timeFromater";
import ItemTypes from "./../../../../DndItemTypes";
import PlaybackButton from "./../../../PlaybackButton/PlaybackButton";
import PlaylistContext from "./../PlaylistContext";
import {Button} from "react-bootstrap";

const PlaylistItem = props => {
  const ref = useRef(null)
  const ctx = useContext(PlaylistContext);

  let track = {
    ...props.item
  }

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.TRACK,
      index: props.listIndex,
      track: track
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    begin: props.dragStart,
    end: (_, monitor) => {
      if (monitor.didDrop() && monitor.getDropResult().target === "playlist") {
        props.endWithin()
      } else {
        props.endOutside()
      }
    }
  })

  const [, drop] = useDrop({
    accept: ItemTypes.TRACK,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index;
      const hoverIndex = props.listIndex;

      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // only if more than half
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // only if more than half
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      props.swapItems(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
    drop: () => {
      return {
        target: "playlist"
      }
    }
  })

  drag(drop(ref));

  const style = {
    opacity: (isDragging) ? 0 : 1
  }

  const timeFormatting = time => formater.secondsToStr(time);

  const bpmFormatting = bpm => {
    if (!bpm) {
      return null;
    } else if (bpm === "calculating") {
      return (<Spin className="bpm-load-spin" />)
    } else {
      return bpm.toFixed(2)
    }
  }

  return (
    <tr
      ref={ref}
      className={"track-list-table-row " + (track.wasLoaded ? "lowlight" : "")}
      style={style}
      onMouseEnter={ctx.setHover.bind(null, props.listIndex)}>
        {props.player && 
          <td className="track-list-table-col btn-playback">
            <PlaybackButton
              className={"btn--play"}
              playback={props.controls.playback}
              player={props.player}
              id={track.sourceId}
              source={track.source}
            />
          </td>
        }
        <td className="track-list-table-col index">{props.listIndex + 1}</td>
        <td className="track-list-table-col source">{track.source}</td>
        <td className="track-list-table-col title overflow">{track.title}</td>
        <td className="track-list-table-col quality">{track.quality}</td>
        <td className="track-list-table-col time">{timeFormatting(track.duration)}</td>
        <td className="track-list-table-col bpm">{bpmFormatting(track.bpm)}</td>
        { props.withSends &&
          <td className="track-list-table-col destination">
            <Button className="btn-dest dest-a"
                    onClick={e => props.load(track, "A")}
                    {...(props.channelPaused ? {disabled: !props.channelPaused.A} : {})}
            > A </Button>
            <Button className="btn-dest dest-b"
                    onClick={e => props.load(track, "B")}
                {...(props.channelPaused ? {disabled: !props.channelPaused.B} : {})}
            > B </Button>
          </td>
        }
    </tr>
  )
}


export default PlaylistItem;

