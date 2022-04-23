/**
 * Container Generator
 */

import { Actions, PlopGeneratorConfig } from 'node-plop';
import inquirer from 'inquirer';

import { pathExists } from '../utils';
import { baseGeneratorPath } from '../paths';

inquirer.registerPrompt('directory', require('inquirer-directory'));

export enum ApiProptNames {
  'apiName' = 'apiName',
  'path' = 'path',
}

type Answers = { [P in ApiProptNames]: string };

export const apiGenerator: PlopGeneratorConfig = {
  description: 'Add a redux toolkit api',
  prompts: [
    {
      type: 'input',
      name: ApiProptNames.apiName,
      message: 'What should it be called (automatically adds ...Api postfix)',
    },
    {
      type: 'directory',
      name: ApiProptNames.path,
      message: 'Where do you want it to be created?',
      basePath: `${baseGeneratorPath}`,
    } as any,
  ],
  actions: data => {
    const answers = data as Answers;

    const apiPath = `${baseGeneratorPath}/${answers.path}`;
    const apiFilePath = `${baseGeneratorPath}/${answers.path}/${answers.apiName}`;

    if (pathExists(apiFilePath)) {
      throw new Error(`Api '${answers.apiName}' already exists`);
    }
    const actions: Actions = [];

    actions.push({
      type: 'add',
      path: `${apiPath}/${answers.apiName}.ts`,
      templateFile: './api/index.ts.hbs',
      abortOnFail: true,
    });

    actions.push({
      type: 'prettify',
      data: { path: `${apiPath}/**` },
    });

    return actions;
  },
};
