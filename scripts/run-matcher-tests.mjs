import fs from 'node:fs';
import ts from 'typescript';

function compileAndEval(filePath) {
  const tsCode = fs.readFileSync(filePath, 'utf8');
  const result = ts.transpileModule(tsCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return result.outputText;
}

// 1. Compile & load creators
const creatorsJs = compileAndEval('./lib/data/creators.ts')
  .replace(/require\(["']@\/types["']\);?/g, '{}');
const creatorsModule = { exports: {} };
new Function('module', 'exports', 'require', creatorsJs)(
  creatorsModule,
  creatorsModule.exports,
  () => ({})
);
const { mockCreators } = creatorsModule.exports;

// 2. Compile & load matcher
const matcherJs = compileAndEval('./lib/matcher.ts')
  .replace(/require\(["']@\/types["']\);?/g, '{}');
const matcherModule = { exports: {} };
new Function('module', 'exports', 'require', matcherJs)(
  matcherModule,
  matcherModule.exports,
  () => ({})
);
const { matchCreatorToBrief, matchCreatorsToBrief } = matcherModule.exports;

// 3. Compile & run tests
const testTs = fs.readFileSync('./tests/matcher.test.ts', 'utf8');
const testJs = ts.transpileModule(testTs, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const testModule = { exports: {} };
const customRequire = (specifier) => {
  if (specifier === '@/lib/data/creators') return { mockCreators };
  if (specifier === '@/lib/matcher') return { matchCreatorToBrief, matchCreatorsToBrief };
  if (specifier === '@/types') return {};
  return {};
};

new Function('module', 'exports', 'require', testJs)(
  testModule,
  testModule.exports,
  customRequire
);
