import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import ItemTypes from '../../ItemTypes'
const style = {
    border: '1px dashed gray',
    padding: '0.5rem',
    margin: '0.5rem',
};

const Signature = ({ color, children }) => {
    const [forbidDrag] = useState(false);
    const [, drag] = useDrag({
        item: { type: ItemTypes.SIGNATURE },
        canDrag: !forbidDrag,
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag} style={style}>
            <small>Signature</small>
        </div>
    )
};

export default Signature