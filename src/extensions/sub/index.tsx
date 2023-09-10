import './index.scss';
import React, { useEffect } from 'react';
import { createTag } from '../../createTag';
import { NodeViewWrapper } from '@tiptap/react';
import { ssmlTags, throttle } from '../../utils';
import { SSMLInput } from '../../components/input';
import { IReactNodeProps } from '../../types';

const SubTagNode = (props: IReactNodeProps) => {
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

    const onPhChange = (alias: string) => {
        props.updateAttributes({
            alias,
        });
    };

    const remove = () => {
        props.editor.chain().deleteCurrentNode().run();
    };

    const renderAttrs = () => {
        const { node } = props;
        const { attrs } = node;

        return <SSMLInput {...props} value={attrs.alias} onChange={onPhChange} onRemove={remove} />;
    };

    const onFocus = () => {
        const pos = props.getPos();
        props.editor.commands.focus(pos);
    };

    return (
        <NodeViewWrapper>
            <span className="react-node-ssml-tag sub">
                <span data-name="sub" onClick={onFocus}>
                    {props.node.attrs.text}
                </span>
                <span className="attrs-mark">{renderAttrs()}</span>
            </span>
        </NodeViewWrapper>
    );
};

export const SubTag = createTag<{ alias: string }>(
    ssmlTags['sub'],
    {
        attributes: {
            alias: {
                default: '',
            },
        },
        commands: {
            setSub:
                (text: string, attrs?: { alias: string }) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: ssmlTags['sub'],
                        attrs: {
                            text,
                            ...(attrs || { alias: '' }),
                        },
                    });
                },
        },
    },
    SubTagNode,
);
