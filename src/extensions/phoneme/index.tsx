import './index.scss';
import React, { useCallback, useState, useRef } from 'react';
import { createTag } from '../../createTag';
import { NodeViewWrapper } from '@tiptap/react';
import { ssmlTags } from '../../utils';
import { useTagRemove, useClickContainTarget, useMethods, useMethodWhileMounted } from '../../hooks';
import { SSMLInput, IInputRefHandler, TagWrapper } from '../../components';
import { IReactNodeProps, TAlphabet } from '../../types';

let enterdownTime = Date.now();
const PhonemeTagNode = (props: IReactNodeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
    const [showInput, setShowInput] = useState(!props.node.attrs._existing);
    useTagRemove(props, () => enterdownTime);
    const inputHandler = useRef<IInputRefHandler>(null);
    const valueRef = useRef(props.node.attrs.ph);
    const { node } = props;
    const { attrs } = node;

    useClickContainTarget(wrap, (contains) => {
        if (!wrap) {
            return;
        }
        setShowInput(contains);
        if (contains) {
            inputHandler.current?.focus();
        }
    });

    const { updateAttributes } = useMethods({
        updateAttributes(attrs: Record<string, any>) {
            props.updateAttributes({ ...props.node.attrs, ...attrs });
        },
    });

    const wrapCb = useMethodWhileMounted((node) => {
        setWrap(node);
    });

    const wrapRef = useCallback((node) => {
        if (node) {
            setTimeout(() => wrapCb(node), 500);
            setTimeout(() => {
                inputHandler.current?.focus();
            }, 35);

            updateAttributes({
                _existing: '1',
            });
        }
    }, []);

    const onPhChange = (ph: string) => {
        ph = (ph || '').trim();
        updateAttributes({
            ph,
            _empty: ph ? '' : '1',
        });
        valueRef.current = ph;
    };

    const onEnterdown = useCallback((time: number) => (enterdownTime = time), []);

    const onEnd = useMethodWhileMounted(() => {
        setShowInput(false);
        setIsEditing(false);
    });

    const renderAttrs = () => {
        return (
            <SSMLInput
                {...props}
                value={attrs.ph}
                showInput={showInput}
                ref={inputHandler}
                onChange={onPhChange}
                onEnd={onEnd}
            />
        );
    };

    return (
        <NodeViewWrapper>
            <span ref={wrapRef}>
                <TagWrapper className="react-node-ssml-tag phoneme" onEnterdown={onEnterdown}>
                    <span data-name="phoneme" className={`${isEditing || !attrs.ph ? 'editing' : ''}`}>
                        {props.node.attrs.text}
                    </span>
                    <span className="attrs-mark">{renderAttrs()}</span>
                </TagWrapper>
            </span>
        </NodeViewWrapper>
    );
};

export const PhonemeTag = createTag<{ ph: string; alphabet: TAlphabet; _existing: string; _empty: string }>(
    ssmlTags['phoneme'],
    {
        attributes: {
            ph: {
                default: '',
            },
            alphabet: {
                default: '',
            },
            _existing: {
                default: '',
            },
            _empty: {
                default: '1',
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
