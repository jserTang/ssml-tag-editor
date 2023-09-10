import './index.scss';
import React from 'react';
import { createTag } from '../../createTag';
import { NodeViewWrapper } from '@tiptap/react';
import { ssmlTags } from '../../utils';
import { IReactNodeProps } from '../../types';
import { BreakTimeSelector } from '../../components/breakTimeSelector';

const BreakTagNode = (props: IReactNodeProps) => {
    const onFocus = () => {
        const pos = props.getPos();
        props.editor.commands.focus(pos);
    };

    return (
        <NodeViewWrapper>
            <span onClick={onFocus} className="react-node-ssml-tag break">
                <span className="attrs-mark">
                    <BreakTimeSelector {...props} />
                </span>
            </span>
        </NodeViewWrapper>
    );
};

export const BreakTag = createTag<{ time: string }>(
    ssmlTags['break'],
    {
        attributes: {
            time: {
                default: '1s',
            },
        },
        commands: {
            setBreakTime:
                (time = '1s') =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: ssmlTags['break'],
                        attrs: {
                            time,
                        },
                    });
                },
        },
    },
    BreakTagNode,
);
