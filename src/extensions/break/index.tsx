import './index.scss';
import * as React from 'react';
import { ssmlTags } from '../../utils';
import { createTag } from '../../createTag';
import { NodeViewWrapper } from '@tiptap/react';
import { IReactNodeProps } from '../../types';
import { BreakTimeInput } from '../../components/breakTimeInput';

const BreakTagNode = (props: IReactNodeProps) => {
    const { node } = props;
    const { attrs } = node;
    const onChange = (time: string) => {
        props.updateAttributes({
            time,
        });
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const pos = props.getPos();
        props.editor.commands.focus(pos + 1);
        e.preventDefault();
        return false;
    };

    return (
        <NodeViewWrapper>
            <span className="react-node-ssml-tag break" onMouseDown={onMouseDown}>
                <span className="attrs-mark">
                    <BreakTimeInput {...props} value={attrs.time} onChange={onChange} />
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
