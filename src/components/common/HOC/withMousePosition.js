import React from "react";

export default function withMousePosition(WrappedComponent) {
  return class extends React.Component {
    state = {
      mouse: {
        x: 0,
        y: 0
      }
    };

    handleMousePostion(event) {
      const el = event.target.closest("div");
      if (el) {
        const { top, left } = el.getBoundingClientRect();
        this.setState({
          ...this.state,
          mouse: {
            ...this.state.mouse,
            y: event.clientY - top,
            x: event.clientX - left
          }
        });
      }
    }

    render() {
      return (
        <WrappedComponent
          evnetsHandlers={{ onMouseMove: this.handleMousePostion.bind(this) }}
          {...this.props}
          {...this.state}
        />
      );
    }
  };
}
