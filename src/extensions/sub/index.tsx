import "./index.scss";
import React, { useCallback, useState, useRef } from "react";
import { createTag } from "../../createTag";
import { NodeViewWrapper } from "@tiptap/react";
import { ssmlTags } from "../../utils";
import { useTagRemove, useClickContainTarget, useMethods, useMethodWhileMounted } from "../../hooks";
import { SSMLInput, TagWrapper, IInputRefHandler } from "../../components";
import { IReactNodeProps } from "../../types";

let enterdownTime = Date.now();
const SubTagNode = (props: IReactNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  const [showInput, setShowInput] = useState(!props.node.attrs._existing);
  useTagRemove(props, () => enterdownTime);
  const inputHandler = useRef<IInputRefHandler>(null);
  const valueRef = useRef(props.node.attrs.alias);
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
        _existing: "1",
      });
    }
  }, []);

  const onPhChange = (alias: string) => {
    alias = (alias || "").trim();
    updateAttributes({
      alias,
      _empty: alias ? "" : "1",
    });
    valueRef.current = alias;
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
        value={attrs.alias}
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
        <TagWrapper
          className="react-node-ssml-tag sub"
          onEnterdown={onEnterdown}
        >
          <span
            data-name="sub"
            className={`${isEditing || !attrs.alias ? "editing" : ""}`}
          >
            {props.node.attrs.text}
          </span>
          <span className="attrs-mark">{renderAttrs()}</span>
        </TagWrapper>
      </span>
    </NodeViewWrapper>
  );
};

export const SubTag = createTag<{ alias: string }>(
  ssmlTags["sub"],
  {
    attributes: {
      alias: {
        default: "",
      },
    },
    commands: {
      setSub:
        (text: string, attrs?: { alias: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: ssmlTags["sub"],
            attrs: {
              text,
              ...(attrs || { alias: "" }),
            },
          });
        },
    },
  },
  SubTagNode
);
