import './index.scss';
import React, { useEffect } from 'react';
import { createTag } from '../../createTag';
import { NodeViewWrapper } from '@tiptap/react';
import { ssmlTags, throttle } from '../../utils';
import { SSMLInput } from '../../components/input';
import { IReactNodeProps, TAlphabet } from '../../types';

const PhonemeTagNode = (props: IReactNodeProps) => {
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

    const onPhChange = (ph: string) => {
        props.updateAttributes({
            ph,
        });
    };

    const remove = () => {
        props.editor.chain().deleteCurrentNode().run();
    };

    const renderAttrs = () => {
        const { node } = props;
        const { attrs } = node;

        return <SSMLInput {...props} value={attrs.ph} onChange={onPhChange} onRemove={remove} />;
    };

    const onFocus = () => {
        const pos = props.getPos();
        props.editor.commands.focus(pos);
    };

    return (
        <NodeViewWrapper>
            <span className="react-node-ssml-tag phoneme">
                <span data-name="phoneme" onClick={onFocus}>
                    {props.node.attrs.text}
                </span>
                <span className="attrs-mark">{renderAttrs()}</span>
            </span>
        </NodeViewWrapper>
    );
};

export const PhonemeTag = createTag<{ ph: string; alphabet: TAlphabet }>(
    ssmlTags['phoneme'],
    {
        attributes: {
            ph: {
                default: '',
            },
            alphabet: {
                default: '',
            },
        },
        commands: {
            setPhoneme:
                (text: string, attrs?: { ph: string; alphabet?: TAlphabet }) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: ssmlTags['phoneme'],
                        attrs: {
                            text,
                            ...(attrs || { ph: '' }),
                        },
                    });
                },
        },
    },
    PhonemeTagNode,
);
