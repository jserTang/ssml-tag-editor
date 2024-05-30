import './index.scss';
import { If } from '../if';
import { IReactNodeProps } from '../../types';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';

interface IProps {
    value: string;
    showInput: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
    onEnd: () => void;
}

export interface IInputRefHandler {
    focus: VoidFunction;
}

export const SSMLInput = forwardRef((props: IReactNodeProps & IProps, ref: React.Ref<IInputRefHandler>) => {
    const { placeholder = '', onEnd } = props;
    const valueRef = useRef(props?.value);
    const inputRef = useRef<HTMLInputElement>(null);
    valueRef.current = props?.value;

    useImperativeHandle(ref, () => ({
        focus() {
            setTimeout(() => {
                inputRef.current && inputRef.current.focus();
            }, 35);
        },
    }));

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.target.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!e.currentTarget.value.trim()) {
                props.deleteNode();
            } else {
                onEnd();
            }
            props.editor.commands.focus(props.getPos() + 1);
        }
        e.stopPropagation();
    };

    return (
        <span className="ssml-tag-value-select">
            <If condition={!!props.value}>
                <span className="ssml-tag-value-select__value">{props.value}</span>
            </If>
            <If condition={props.showInput}>
                <div className="ssml-tag-value-select__inputbox">
                    <input
                        ref={inputRef}
                        autoFocus
                        type="text"
                        value={props.value}
                        placeholder={placeholder}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                    />
                </div>
            </If>
        </span>
    );
});
