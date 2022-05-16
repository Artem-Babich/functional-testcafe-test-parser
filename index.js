import * as fs from 'fs';
import { getRegressionName, getTestPath, parseTestNames } from './utils.js';
import { getFixtureTemplate, getTestTemplate } from './template.js';

const args            = process.argv;
const testFilePath    = args.pop();
const testFileContent = fs.readFileSync(testFilePath).toString();
const testNames       = parseTestNames(testFileContent);
const testPath        = `./${getTestPath(testFilePath)}`;
const resultTests     = testNames.map(tn => getTestTemplate(tn, testPath));
const regressionName  = getRegressionName(testFilePath);
const resultCode      = getFixtureTemplate(regressionName, resultTests);

console.log(resultCode);




