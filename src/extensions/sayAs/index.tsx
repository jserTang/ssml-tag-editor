import './index.scss';
import * as React from 'react';
import { createTag } from '../../createTag';
import { useTagRemove } from '../../hooks';
import { TagWrapper } from '../../components';
import { NodeViewWrapper } from '@tiptap/react';
import { ssmlTags } from '../../utils';
import { NumberInterpretSelector } from '../../components/numberInterpretSelector';
import { IReactNodeProps, IMarkerSelectorProps, NumberInterpret } from '../../types';

const sayAsAttrsTags: { [key: string]: (props: IMarkerSelectorProps) => JSX.Element | null } = {
    'interpret-as': NumberInterpretSelector,
};

let enterdownTime = Date.now();
const SayAsTagNode = (props: IReactNodeProps) => {

    useTagRemove(props, () => enterdownTime);

    const onEnterdown = React.useCallback((time: number) => (enterdownTime = time), []);

    const onMouseDown = () => {
        const pos = props.getPos();
        props.editor.commands.focus(pos + 1);
    };

    const renderAttrs = () => {
        const { node } = props;
        const { attrs } = node;
        const attrTags = [];
        for (const key in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, key)) {
                if (!!sayAsAttrsTags[key]) {
                    const SayAsAttrsTag = sayAsAttrsTags[key];
                    attrTags.push(<SayAsAttrsTag key={key} {...props} />);
                }
            }
        }
        return attrTags;
    };

    return (
        <NodeViewWrapper>
            <TagWrapper className="react-node-ssml-tag say-as" onMouseDown={onMouseDown} onEnterdown={onEnterdown}>
                <span data-name="say-as">{props.node.attrs.text}</span>
                <span className="attrs-mark">{renderAttrs()}</span>
            </TagWrapper>
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
    SayAsTagNode,
);
