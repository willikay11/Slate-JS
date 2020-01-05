import React, { useCallback, useMemo, useState, useEffect } from 'react'
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, Transforms, createEditor } from 'slate'
import { withHistory } from 'slate-history';
import { useDrop } from 'react-dnd'
import { Row, Col, Affix } from 'antd';

import ItemTypes from './ItemTypes'
import { Button, SlateIcon, Toolbar } from './toolbar'
import DragSource from "./DragSource/index";
import Box from './Box'
import CustomDragLayer from "./CustomerDragLayer";
import update from "immutability-helper";
import CustomParagraph from "./Blocks/paragraph";

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const editorStyle = {
    height: 700,
    width: 650,
    backgroundColor: 'white',
    boxShadow: '0 5px 5px rgba(0,0,0,.15)',
    position: "relative",
    padding: 20
};

const Signature = props => {
   return (
        <div contentEditable={false} style={{ height: 50, width: 100, border: '1px solid #dfdfdf', pointerEvents: 'none', cursor: 'pointer' }}>
            <span>{props.children}</span>
        </div>
   );
};

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
};

const MyEditor = () => {
    const [value, setValue] = useState(initialValue);
    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'signature':
                return (
                    <Box id={props.element.id} left={props.element.location.left} top={props.element.location.top} hideSourceOnDrag={false}>
                        <Signature {...props} />
                    </Box>
                );
            default:
                return (
                    <CustomParagraph id={props.element.id} left={props.element.location.left} top={props.element.location.top} hideSourceOnDrag={false}>
                        <DefaultElement {...props} />
                    </CustomParagraph>
                );
        }
    }, []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    const [, drop] = useDrop({
        accept: [ItemTypes.BOX, ItemTypes.SIGNATURE, ItemTypes.PARAGRAPH],
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            const itemType = monitor.getItemType();
            let left = Math.round(item.left + delta.x);
            let top = Math.round(item.top + delta.y);

            let newBlock = null;

            if(item.left === undefined) {
                left = 80;
                top = delta.y;
                newBlock = {
                    id: 6,
                    type: itemType,
                    children: [{ text: "This is a new paragraph" }],
                    location: { top, left }
                }
            }

            moveBox(item.id, left, top, newBlock);
            return undefined
        },
    });

    const moveBox = (id, left, top, newBlock) => {
        if (newBlock === null) {
            const index = value.findIndex(obj => obj.id === id);
            setValue(
                update(value, {
                    [index]: { location: {$merge: { top, left }}},
                }),
            )
        } else {
            setValue(value => [ ...value, newBlock]);
        }

    };

    return (
        <Row>
            <Col span={20}>
                <Slate editor={editor} value={value} onChange={value => setValue(value)}>
                    <Affix offsetTop={0}>
                        <Toolbar>
                            <MarkButton format="bold" icon="bold" />
                            <MarkButton format="italic" icon="italic" />
                            <MarkButton format="underline" icon="underline" />
                            <MarkButton format="code" icon="code" />
                            <BlockButton format="heading-one" icon="looks_one" />
                            <BlockButton format="heading-two" icon="looks_two" />
                            <BlockButton format="block-quote" icon="quote" />
                            <BlockButton format="numbered-list" icon="ordered-list" />
                            <BlockButton format="bulleted-list" icon="unordered-list" />
                        </Toolbar>
                    </Affix>
                    {/*Wrap the editable section in a draggable container*/}
                    <div style={{ flexDirection: 'row', display: 'flex', height: '100vh', width: '100%', overflow: 'scroll', backgroundColor: '#dfdfdf', alignItems: 'center', justifyContent: 'center'}}>
                        <div ref={drop} style={editorStyle}>
                            <Editable
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                                placeholder="Enter some rich text…"
                                spellCheck
                                autoFocus
                                onKeyDown={event => {
                                    for (const hotkey in HOTKEYS) {
                                        if (isHotkey(hotkey, event)) {
                                            event.preventDefault();
                                            const mark = HOTKEYS[hotkey];
                                            toggleMark(editor, mark)
                                        }
                                    }
                                }}
                            />
                        </div>
                        <CustomDragLayer/>
                    </div>
                </Slate>
            </Col>
            <Col span={4} style={{ flexDirection: "column", flex: 1, display: 'flex'}}>
                <DragSource/>
            </Col>
        </Row>
    )
};

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: n => LIST_TYPES.includes(n.type),
        split: true,
    });

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    });

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block)
    }
};

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
};

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n => n.type === format,
    });

    return !!match
};

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false
};

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>;
        default:
            return <p {...attributes}>{children}</p>
    }
};

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
};

const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault();
                toggleBlock(editor, format)
            }}
        >
            <SlateIcon type={icon} />
        </Button>
    )
};

const MarkButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault();
                toggleMark(editor, format)
            }}
        >
            <SlateIcon type={icon} />
        </Button>
    )
};

const initialValue = [
    {
        id: 1,
        type: 'paragraph',
        children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', code: true },
            { text: '!' },
        ],
        location: { top: 50, left: 20 }
    },
    {
        id: 2,
        type: 'paragraph',
        children: [
            {
                text:
                    "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
                text:
                    ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
        ],
        location: { top: 130, left: 20 }
    },
    {
        id: 3,
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }],
        location: { top: 230, left: 20 }
    },
    {
        id: 4,
        type: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }],
        location: { top: 310, left: 20 }
    },
    {
        id: 5,
        type: 'signature',
        children: [{ text: "Signature" }],
        location: { top: 390, left: 20 }
    }
];

export default MyEditor;