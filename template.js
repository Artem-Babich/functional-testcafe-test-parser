export const getTestTemplate = (name, path) => {
    return `it('${name}', () => {\n    return runTests('${path}', '${name}', { skip: ['ie'] });\n});`
}
export const getFixtureTemplate = (regressionName, tests) => {
    return `describe('[Regression](GH-${ regressionName })', () => {\n
    ${ tests.join('\n') }
    \n});`
}



