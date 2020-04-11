import React, { useContext, useRef } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { loadTrack, deleteTrack } from "../../../../../../actions";
import PlaylistContext from "./../PlaylistContext";
import { useDrag, useDrop } from "react-dnd";
import ItemTypes from "./../../../../appItemTypes";
import { Spin } from "react-loading-io";
import { formater } from "./../../../../../../utils/time/timeFromater";

const PlaylistItem = props => {
  const ref = useRef(null)

  const ctx = useContext(PlaylistContext);

  let track = {
    ...props.item
  }
  track.source = track.source;

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

  const [_, drop] = useDrop({
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

  ///--------- formatingg
  const timeFormating = time => formater.secondsToStr(time);

  const bpmFromating = bpm => {
    if (!bpm) {
      return null;
    } else if (bpm === "calculating") {
      return (<Spin className="playlist-loader" />)
    } else {
      return bpm.toFixed(2)
    }
  }

  return (
    <tr
      ref={ref}
      className="track-list-table-row"
      style={style}
      onMouseEnter={ctx.setHover.bind(null, props.listIndex)}>
      <td className="track-list-table-col source">{props.listIndex + 1}</td>
      <td className="track-list-table-col source">{track.source}</td>
      <td className="track-list-table-col title">{track.title}</td>
      <td className="track-list-table-col quality">{track.quality}</td>
      <td className="track-list-table-col time">{timeFormating(track.duration)}</td>
      <td className="track-list-table-col bpm">{bpmFromating(track.bpm)}</td>
      {/*  <td className="track-list-table-col">
                    <Button className="btn-dest dest-a" onClick={e => props.load(track, "A")}>A</Button>
                    <Button className="btn-dest dest-b" onClick={e => props.load(track, "B")}>B</Button>
        </td>*/}
    </tr>
  )
}

const mapDispatchToProps = dispach => ({
  load: (track, destination) => dispach(loadTrack(track, destination))
})

export default connect(null, mapDispatchToProps)(PlaylistItem);

