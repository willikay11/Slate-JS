import React, {useEffect} from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ItemTypes from '../../ItemTypes'

import { TextBox, Paragraph } from "./style";

function getStyles(left, top, isDragging) {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return {
        position: 'absolute',
        transform,
        WebkitTransform: transform,
        // IE fallback: hide the real node using CSS when dragging
        // because IE will ignore our custom "empty image" drag preview.
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : '',
        width: '90%',
    }
}

const CustomParagraph = ({ id, left, top, children }) => {
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: ItemTypes.BOX, id, left, top },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, []);

    return (
        <TextBox ref={drag} style={getStyles(left, top, isDragging)}>
            <Paragraph>{children}</Paragraph>
        </TextBox>
    )
};
export default CustomParagraph