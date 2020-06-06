import React, { useMemo, useCallback } from "react"
import { Button } from "react-bootstrap";
import ErrorBoundary from "./../ErrorBoundary/ErrorBoundary";
import UUDI from "uuidjs"
import "./pagin.scss";

const Pagin = ({ current, all, wide = 2, call }) => {

    const separator = useCallback(()=> <div key={UUDI.genV1()} className="pagin-separator"></div>, [])

    const button = useCallback((index, text) => {
        return <Button
            key={index}
            className={"pagin-btn" + ((index === +current) ? " btn--active" : "")}
            onClick={call && call.bind(null, index)}>
            {(text || index)}
        </Button>
    }, [call, current])

    const buttons = useMemo(() => {
        const _current = +current; 
        let curr = button(_current);
        let pre = [];
        let next = []
        if (_current > 0) {
            let i;
            for (i = _current - 1; i >= 0 && i >= (_current  - wide); i--) {
                pre.unshift(button(i))
            }
            if (i >= 0) {
                pre.unshift(separator())
                pre.unshift(button(0))

            }
        }
        if (_current < all) {
            let i;
            for (i = _current + 1; i <= all && i <= _current + wide ; i++) {
                next.push(button(i))
            }
            if (i <= all) {
                next.push(separator())
                next.push(button(all))
            }
        }

        return [...pre, curr, ...next]
    }, [current, all, wide, button, separator])

    return (
        <ErrorBoundary>
            <div className="pagin">{buttons && buttons.length > 1 && buttons}</div>
        </ErrorBoundary>
    )
}

export default Pagin