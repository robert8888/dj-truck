import React from 'react';
import {
    Table,
    THead,
    TBody,
    TRow
} from "./Table";
import UUID from 'uuidjs';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const TrackTable = ({ cols, items, className, onClickRow = idle => null }) => {


    return (
        <ErrorBoundary>
            <Table className={"track-table " + className}>
                <THead cols={cols} />
                <TBody>
                    {(items && items.length > 0) &&
                        items.map((item, i) =>
                            <TRow
                                cols={cols}
                                data={{...item, index: i + 1}}
                                key={UUID.genV1()}
                                onClick={onClickRow.bind(null, i, item.id)} />
                        )
                    }
                </TBody>
            </Table>
        </ErrorBoundary>
    )
}

export default TrackTable;