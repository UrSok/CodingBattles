/* eslint-disable no-useless-escape */
import { languages } from 'monaco-editor';

export const stubInputLang = 'stubinputlang';

export const stubLangDefinitions: languages.IMonarchLanguage = {
  keywords: ['input', 'inputloop', 'output'],
  numberTypes: /(int|float|bool)/,//['int', 'float', 'bool'],
  stringTypes: /(word|string)\.\d+/,
  variableName: /(_|[a-z])+[[:alnum:]]*/,
  tokenizer: {
    root: [
      //[//, ],
      //identifiers and keywords
      [
        /[ ]*[a-z]*/,
        {
          cases: {
            '@keywords': {
              cases: {
                input: { token: 'keyword', next: '@variables' },
                inputloop: { token: 'keyword', next: '@inputloopKeyword' },
                output: { token: 'keyword', next: '@outputKeyword' },
              },
            },
            '@default': 'invalid',
          }
        },
      ],
    ],
    variables: [
      [/\s/, 'identifier', '@variable'],
      ['', 'identifier', '@popall'],
    ],
    variable: [
      [/\:/, 'identifier', '@variableType'],
      [/(_|[a-z])+[a-z0-9_$]*/, 'attribute'],
      [/.*$/, 'invalid', '@popall'],
      ['', 'identifier', '@popall'],
    ],
    variableType: [
      [/@stringTypes/, 'type.identifier', '@variables'],
      [/@numberTypes/, 'type.identifier', '@variables'],
      // TODO: FIX THE: v:intsalut:int someday
    ],
    inputloopKeyword: [
      [/\s(_|[a-z])+[a-z0-9_$]*\s/, 'annotation', '@variables'],
      [/\s[0-9]+\s/, 'number', '@variables'],
      [/.*$/, 'invalid', '@popall'],
      ['', 'identifier', '@popall'],
    ],
    outputKeyword: [[/\s.*/, 'string.body', '@popall']],
  },
};
