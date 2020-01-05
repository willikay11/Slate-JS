import React, {useEffect} from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes'
const style = {
    position: 'absolute',
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    cursor: 'move',
};

function getStyles(left, top, isDragging) {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return {
        position: 'absolute',
        transform,
        WebkitTransform: transform,
        border: '1px dashed gray',
        backgroundColor: 'white',
        padding: '0.5rem 1rem',
        cursor: 'move',
        // IE fallback: hide the real node using CSS when dragging
        // because IE will ignore our custom "empty image" drag preview.
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : '',
    }
}

const Box = ({ id, left, top, hideSourceOnDrag, children }) => {
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: ItemTypes.BOX, id, left, top },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, []);

    // if (isDragging && hideSourceOnDrag) {
    //     return <div ref={drag} />
    // }
    return (
        <div ref={drag} style={getStyles(left, top, isDragging)}>
            {children}
        </div>
    )
};
export default Box