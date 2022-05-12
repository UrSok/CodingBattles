import { TestPair } from 'app/api/types/challenge';
import { Language } from 'app/types/global';

export const FormFields = {
  name: 'name',
  tags: 'tags',
  descriptionShort: 'descriptionShort',
  descriptionMarkdown: 'descriptionMarkdown',
  stubLanguage: 'stubLanguage',
  stubInput: 'stubInput',
  tests: 'tests',
  testTitle: 'title',
  caseInput: ['case', 'input'],
  caseExpectedOutput: ['case', 'expectedOutput'],
  validatorInput: ['validator', 'input'],
  validatorExpectedOutput: ['validator', 'expectedOutput'],
  solutionLanguage: 'solutionLanguage',
  solution: 'solution',
  solutionStatus: 'solutionStatus',
};

type Status = 'Empty' | 'Invalid' | 'Valid';

export type FormType = {
  name: string;
  tags: string[];
  descriptionShort: string;
  descriptionMarkdown: string;
  stubLanguage: string;
  stubInput: string;
  tests: TestPair[];
  solutionLanguage: string;
  solution: string;
  solutionStatus: Status;
};
