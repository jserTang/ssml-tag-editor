import './index.scss';
import React, { useEffect } from 'react';
import { createTag } from '../../createTag';
import { NodeViewWrapper } from '@tiptap/react';
import { ssmlTags, throttle } from '../../utils';
import { NumberInterpretSelector } from '../../components/numberInterpretSelector';
import { IReactNodeProps, IMarkerSelectorProps, NumberInterpret } from '../../types';

const sayAsAttrsTags: { [key: string]: (props: IMarkerSelectorProps) => JSX.Element | null } = {
    'interpret-as': NumberInterpretSelector,
};

const SatAsTagNode = (props: IReactNodeProps) => {
    const remove = (_attrName?: string) => {
        props.editor.chain().deleteCurrentNode().run();
    };

    useEffect(() => {
        let pos = props.getPos();
        const listen = throttle(() => {
            pos = props.getPos() || pos;
        }, 100);
        props.editor.on('update', listen);
        return () => {
            const { from, to } = props.editor.state.selection;
            const onlyDeleteTag = pos === from && from === to;
            onlyDeleteTag && props.editor.chain().focus(from).insertContent(`${props.node.attrs.text}`).run();
            props.editor.off('update', listen);
        };
    }, []);

    const renderAttrs = () => {
        const { node } = props;
        const { attrs } = node;
        const attrTags = [];
        for (const key in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, key)) {
                if (!!sayAsAttrsTags[key]) {
                    const SayAsAttrsTag = sayAsAttrsTags[key];
                    attrTags.push(<SayAsAttrsTag key={key} {...props} remove={remove} />);
                }
            }
        }
        return attrTags;
    };

    const onFocus = () => {
        const pos = props.getPos();
        props.editor.commands.focus(pos);
    };

    return (
        <NodeViewWrapper>
            <span onClick={onFocus} className="react-node-ssml-tag say-as">
                <span data-name="say-as">{props.node.attrs.text}</span>
                <span className="attrs-mark">{renderAttrs()}</span>
            </span>
        </NodeViewWrapper>
    );
};

export const SayAsTag = createTag<{ 'interpret-as': NumberInterpret }>(
    ssmlTags['say-as'],
    {
        attributes: {
            'interpret-as': {
                default: 'digits',
            },
        },
        commands: {
            setNumberInterpret:
                (text: string, attrs: { 'interpret-as': NumberInterpret }) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: ssmlTags['say-as'],
                        attrs: {
                            text,
                            ...attrs,
                        },
                    });
                },
        },
    },
    SatAsTagNode,
);
