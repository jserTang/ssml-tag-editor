import './index.scss';
import { If } from '../if';
import { IReactNodeProps } from '../../types';
import React, { useEffect, useRef, useState } from 'react';

interface IProps {
    value: string;
    onChange: (value: string) => void;
    onRemove: VoidFunction;
}

export const SSMLInput = (props: IReactNodeProps & IProps) => {
    const [showInput, setShowInput] = useState(true);
    const valueRef = useRef(props.value);
    valueRef.current = props.value;

    useEffect(() => {
        if (!showInput && !valueRef.current.trim()) {
            props.onRemove();
        }
    }, [showInput]);

    const onWrapClick = () => {
        setTimeout(() => {
            setShowInput(true);
        }, 60);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.target.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setShowInput(false);
        }
    };

    return (
        <span className="ssml-tag-value-select" onClick={onWrapClick}>
            <If condition={!showInput}>
                <span className="ssml-tag-value-select__value">{props.value}</span>
            </If>
            <If condition={showInput}>
                <input
                    className="ssml-tag-value-select__input"
                    autoFocus
                    type="text"
                    value={props.value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
            </If>
        </span>
    );
};
