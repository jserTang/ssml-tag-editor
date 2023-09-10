# SSML tag Editor

## description

[What is SSML](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup)

ssml-tag-editor is an editor that generates SSML in a rich text manner. The speech synthesis markup that is tagged in the editor can eventually be exported as SSML string text

ssml-tag-editor 是一款用富文本的方式来生成 SSML 的编辑器。在编辑器内标记的 speech synthesis markup 最终可以导出为 SSML 字符串文本

## Usage
`
npm i ssml-tag-editor
`

Is this a demo of how to use it

这是一个如何使用它的例子

![](https://statics-umu-cn.umucdn.cn/resource/a/8KjU/BU1pr/3653231088.jpg)

``` typescript
import SSMLTagEditor, { ToolBarWrap, IEditorHandler } from 'ssml-tag-editor';

const Demo = () => {
    const editorHandler = useRef<IEditorHandler>(null);
    const [ssml, setSSML] = useState('');

    const addNumberInterpret = () => {
        editorHandler.current?.addNumberInterpret();
    };
    const addBreak = () => {
        editorHandler.current?.addBreak({ time: '0.5s' });
    };
    const addSub = () => {
        editorHandler.current?.addSub();
    };
    const addPhoneme = () => {
        editorHandler.current?.addPhoneme();
    };
    const exportSSML = () => {
        setSSML(editorHandler.current.export().ssml);
    };

    return (
        <div className="ssml-tag-editor-demo">
            <ToolBarWrap className="ssml-tag-editor-demo__tools">
                <button onClick={addNumberInterpret}>
                    <div>add phoneme</div>
                    <div>标注数字读法</div>
                </button>
                <button onClick={addBreak}>
                    <div>add break</div>
                    <div>添加停顿</div>
                </button>
                <button onClick={addSub}>
                    <div>add sub</div>
                    <div>文字替换</div>
                </button>
                <button onClick={addPhoneme}>
                    <div>add phoneme</div>
                    <div>标注读音</div>
                </button>
            </ToolBarWrap>
            <SSMLTagEditor
                ref={editorHandler}
                defaultContent="2023 年，生成式 AI 大模型对我的工作给予了很大的帮助"
                placeholder="Type your text here"
            />
            <button onClick={exportSSML}>Export SSML</button>
            <div className="ssml-tag-editor-demo__result">
                {ssml}
            </div>
        </div>
    );
};
```

## Browsers support 浏览器支持
IE11+

## Document
- SSMLTagEditor 文本编辑区域
- ToolBarWrap
    - The editor does not provide a UI or toolbar directly. The UI for the toolbar button needs to be implemented by the user, but the toolbar component must be a child of the ToolBarWrap to work properly.
    - 该编辑器并不直接提供 UI 以及工具栏。工具栏按钮的 UI 需要使用者自己去实现，但是工具栏组件必须作为 ToolBarWrap 的子元素才可以正常工作

- IEditorHandler
    - For better customizability, the editor does not provide a toolbar, but provides a series of methods to manipulate the editor
    - 为了有更好的可定制性，编辑器并不提供工具栏，但是提供了一系列方法去操作编辑器
        - addNumberInterpret
            - After the number is selected by the cursor, mark the number reading mark
        - addBreak
            - Additive pause
        - addPhoneme，support `'ipa' | 'pinyin' | 'x-sampa'`
            - Annotate word pronunciations for polyphonic scenarios
        - addSub
            - Make phonetic substitutions for words. Such as `W3C` -> `World Wide Web Consortium`

        - getSelectionPos
            - Get cursor position
        - getSelectionText
            - Gets the text selected by the cursor
        - getSelectionSSML
            - Gets the SSML selected by the cursor
        - export
            - export SSML or text or json

        - And so on

- i18n
    - Multilingual support, just need to pass the language attribute to SSMLTagEditor to get the appropriate language support. With built-in support for some languages, you can also customize i18n copywriting by adding an i18n object to the SSMLTagEditor。Currently supported languages are:：`'zh_cn'、'ja_jp'、'zh_tw'、'th_th'、'es_es'、'en_us'、'ko_kr'、'fr_fr'、'id_id'、'ru_ru'、'pt_br'、'de_de'、'it_it'、'vi_vn'`
    - 支持多语，只需要给 SSMLTagEditor 传递 language 属性就可以获得相应的语种支持。内置了对一部分语种的支持，您也可以自定义 i18n 文案，只需要给 SSMLTagEditor 添加一个 i18n 对象即可
