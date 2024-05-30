import "./index.scss";
import * as React from "react";
import { If } from "../if";
import createLang from "../../i18n";
const { useContext, useCallback, useEffect, useRef, useState } = React;
import { useClickContainTarget, useMethodWhileMounted } from "../../hooks";
import { SSMLTagEditorContext } from "../../context";
import { IReactNodeProps } from "../../types";

interface IProps {
  value: string;
  onChange: (value: string) => void;
}

export const BreakTimeInput = (props: IReactNodeProps & IProps) => {
  const [showInput, setShowInput] = useState(false);
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  const valueRef = useRef(props?.value);
  const inputRef = useRef<HTMLInputElement>(null);
  valueRef.current = props?.value;

  const {
    state: { language, i18n },
  } = useContext(SSMLTagEditorContext);
  const lang = createLang(language, i18n);

  const containCb = useMethodWhileMounted(() => {
    setShowInput(true);
    inputRef.current && inputRef.current.focus();
  });

  const wrapCb = useMethodWhileMounted((node) => {
    setWrap(node);
  });

  useClickContainTarget(wrap, (contains) => {
    if (!wrap) {
      return;
    }
    if (!contains) {
      setShowInput(false);
    } else {
      setTimeout(containCb, 60);
    }
  });

  const wrapRef = useCallback((node) => {
    if (node) {
      setTimeout(() => wrapCb(node), 500);
    }
  }, []);

  useEffect(() => {
    if (showInput) {
      setTimeout(() => {
        inputRef.current && inputRef.current.focus();
      }, 60);
    } else if (!parseFloat(valueRef.current)) {
      props.editor.commands.focus();
      setTimeout(() => {
        props.deleteNode();
      }, 60);
    }
  }, [showInput]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value.trim()
      ? Number((+e.target.value).toFixed(1))
      : e.target.value;
    props.onChange(`${numValue}s`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowInput(false);
      props.editor.commands.focus(props.getPos() + 1);
      e.stopPropagation();
    }
  };

  return (
    <span className="ssml-tag-value-select time" ref={wrapRef}>
      <span className="ssml-tag-value-select__value">{props.value}</span>
      <If condition={showInput}>
        <div className="ssml-tag-value-select__inputbox">
          <div className="ssml-tag-value-select__inputbox__inner flex--center">
            <svg id="icon-PauseTime" viewBox="0 0 1024 1024">
              <g transform="scale(64)">
                <path d="M1.6 8C1.6 11.536 4.464 14.4 8 14.4C11.536 14.4 14.4 11.536 14.4 8C14.4 4.464 11.536 1.6 8 1.6C4.464 1.6 1.6 4.464 1.6 8ZM0 8C0 3.584 3.576 0 7.992 0C12.416 0 16 3.584 16 8C16 12.416 12.416 16 7.992 16C3.576 16 0 12.416 0 8ZM7.2 4H8.4V8.2L12 10.336L11.4 11.32L7.2 8.8V4Z"></path>
              </g>
            </svg>
            <input
              ref={inputRef}
              autoFocus
              type="number"
              placeholder={lang("Add pause")}
              value={parseFloat(props.value)}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
            <span className="seconds">S</span>
          </div>
        </div>
      </If>
    </span>
  );
};
