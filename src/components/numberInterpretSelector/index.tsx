import './index.scss';
import { If } from '../if';
import createLang from '../../i18n';
import { IMarkerSelectorProps } from '../../types';
import { SSMLTagEditorContext } from '../../context';
import React, { useCallback, useContext, useState } from 'react';
import { useClickContainTarget } from '../../hooks/useClickContainTarget';

export const NumberInterpretSelector = (props: IMarkerSelectorProps) => {
    const [showSelector, setShowSelector] = useState(false);
    const [wrap, setWrap] = useState<HTMLSpanElement | null>(null);

  const {
    state: { language, i18n },
  } = useContext(SSMLTagEditorContext);
    const lang = createLang(language, i18n);

    useClickContainTarget(wrap, () => {
        setShowSelector(false);
    });

    const numberInterpretValueMap: { [key: string]: any } = {
        digits: lang('Expanded'),
        telephone: lang('Read phone'),
        cardinal: lang('Number by number'),
    };

    const options = [
        { key: 'digits', label: numberInterpretValueMap['digits'] },
        { key: 'cardinal', label: numberInterpretValueMap['cardinal'] },
        { key: 'remove', label: lang('DELETE') },
    ];

    const currentInterpretAs = props.node.attrs['interpret-as'];
    const currentValue = numberInterpretValueMap[currentInterpretAs];

    const wrapRef = useCallback((node) => {
        if (node) {
            setWrap(node);
        }
    }, []);

    if (!props || !currentValue) {
        return null;
    }
    const onWrapClick = () => {
        setTimeout(() => {
            setShowSelector(true);
        }, 60);
    };

    const onSelectInterpret = (type: string) => {
        return () => {
            if (type === 'remove') {
                props.deleteNode();
                return;
            } else {
                props.updateAttributes({
                    'interpret-as': type,
                });
            }
            setTimeout(() => {
                setShowSelector(false);
            }, 60);
        };
    };

    const renderOptionItems = () => {
        return options.map((option) => {
            return (
                <div
                    key={option.key}
                    className={`ssml-tag-value-select__options__item ${
                        option.key === currentInterpretAs ? 'active' : ''
                    }`}
                    onClick={onSelectInterpret(option.key)}
                >
                    {option.label}
                </div>
            );
        });
    };

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
