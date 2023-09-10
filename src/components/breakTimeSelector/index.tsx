import { If } from '../if';
import { IReactNodeProps } from '../../types';
import React, { useCallback, useState } from 'react';
import { useClickContainTarget } from '../../hooks/useClickContainTarget';

export const BreakTimeSelector = (props: IReactNodeProps) => {
    const [showSelector, setShowSelector] = useState(false);
    const [wrap, setWrap] = useState<HTMLSpanElement | null>(null);
    const currentValue = props.node.attrs['time'];

    const options = ['0.5s', '1s', '2s', '3s', '4s', '5s'];

    const wrapRef = useCallback((node) => {
        if (node) {
            setWrap(node);
        }
    }, []);

    const onWrapClick = () => {
        setTimeout(() => {
            setShowSelector(true);
        }, 60);
    };

    useClickContainTarget(wrap, () => {
        setShowSelector(false);
    });

    const onSelect = (time: string) => {
        return () => {
            props.updateAttributes({
                time,
            });
            setTimeout(() => {
                setShowSelector(false);
            }, 60);
        };
    };

    const renderOptionItems = () => {
        return options.map((option) => {
            return (
                <div
                    key={option}
                    className={`ssml-tag-value-select__options__item ${option === currentValue ? 'active' : ''}`}
                    onClick={onSelect(option)}
                >
                    {option}
                </div>
            );
        });
    };

    if (!currentValue) {
        return null;
    }

    return (
        <span className="ssml-tag-value-select" ref={wrapRef} onClick={onWrapClick}>
            <span className="ssml-tag-value-select__value">{currentValue}</span>
            <If condition={showSelector}>
                <ul className="ssml-tag-value-select__options" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    {renderOptionItems()}
                </ul>
            </If>
        </span>
    );
};
