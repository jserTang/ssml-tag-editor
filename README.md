# SSML tag Editor

## Description

[What is SSML](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup)

ssml-tag-editor is an editor that generates SSML in a rich text manner. The speech synthesis markup that is tagged in the editor can eventually be exported as SSML string text

## Usage
```bash
npm i ssml-tag-editor
```

## Demo 
```bash
git clone git@github.com:jserTang/ssml-tag-editor.git
cd ssml-tag-editor
npm i && npm start
```
<img src="https://s2.loli.net/2024/05/30/jai4cNeGFsuTWQB.png" style="width: 600px;" alt="PC">

## Browsers support
IE11+

## Document
- SSMLTagEditor: content editing area

- ToolBarWrap
    - The editor does not provide a UI or toolbar directly. The UI for the toolbar button needs to be implemented by the user, but the toolbar component must be a child of the ToolBarWrap to work properly.

- IEditorHandler
    - For better customizability, the editor does not provide a toolbar, but provides a series of methods to manipulate the editor
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

- i18n
    - Multilingual support, just need to pass the language attribute to SSMLTagEditor to get the appropriate language support. With built-in support for some languages, you can also customize i18n copywriting by adding an i18n object to the SSMLTagEditor。Currently supported languages are:：`'zh_cn'、'ja_jp'、'zh_tw'、'th_th'、'es_es'、'en_us'、'ko_kr'、'fr_fr'、'id_id'、'ru_ru'、'pt_br'、'de_de'、'it_it'、'vi_vn'`

## License
MIT licensed.