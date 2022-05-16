import * as path from 'path';

const TEST_MATCH_PATTERN      = /test\('[a-zA-Z0-9 ]*'.?,.?async t/;
const TEST_NAME_END_PATTERN   = /['|"|`] ?,.?async t/;
const OPEN_BRACE              = '{';
const CLOSE_BRACE             = '}';
const ALLOWED_QUOTES          = ['"', '\'', '`'];

function findLastIndex (str, startIndex) {
    str                   = str.substring(startIndex);
    const firstBraceIndex = str.indexOf(OPEN_BRACE);
    str                   = str.substring(firstBraceIndex);
    let bracesCounter     = 1;
    let i                 = 0;

    while (bracesCounter > 0) {
        i++;
        if (str[i] === OPEN_BRACE)
            bracesCounter++;
        else if (str[i] === CLOSE_BRACE)
            bracesCounter--;

        if (i > 10000)
            throw new Error('Max test length exceeded');
    }

    return i + startIndex + firstBraceIndex;
}

function findTestName (content, startIndex, endIndex) {
    const testContent = content.substring(startIndex, endIndex);
    const nameStart   = Math.min(...ALLOWED_QUOTES.map(q => testContent.indexOf(q)).filter(i => i !== -1)) + 1;
    const nameEnd     = testContent.search(TEST_NAME_END_PATTERN);

    return testContent.substring(nameStart, nameEnd);
}


export function parseTestNames (content) {
    const names = [];
    while (content.search(TEST_MATCH_PATTERN) !== -1) {
        const startIndex = content.search(TEST_MATCH_PATTERN);
        const endIndex   = findLastIndex(content, startIndex);
        const name       = findTestName(content, startIndex, endIndex);

        names.push(name);

        content = content.substring(endIndex);
    }

    return names;
}

export function getTestPath (fullPath) {
    return [path.basename(path.dirname(fullPath)), path.basename(fullPath)].join('/');
}

export function getRegressionName (fullPath) {
    const start = fullPath.indexOf('gh-');
    const length   = fullPath.substring(start).indexOf('\\');
    return fullPath.substring(start, start + length).replace('gh-','');
}
