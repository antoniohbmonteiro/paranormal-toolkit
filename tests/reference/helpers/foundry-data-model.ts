import { readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { createContext, runInContext } from "node:vm";
import ts from "typescript";

// Native model, fields and validation; unrelated document collections are doubled.
export function foundryDataModel(root: string) {
  const vm = createContext({ console, structuredClone });
  function load(relative: string, dependencies: Record<string, unknown>) {
    const filename = isAbsolute(relative) ? relative : join(root, relative);
    const code = ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename + ".ts",
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: false },
    }).outputText;
    vm.nativeExports = {};
    vm.nativeRequire = (name: string) => {
      if (!(name in dependencies)) throw new Error("Unexpected native dependency: " + name);
      return dependencies[name];
    };
    runInContext(`(function(exports, require) { ${code}\n})(nativeExports, nativeRequire);`, vm, { filename, timeout: 2000 });
    return vm.nativeExports as any;
  }
  for (const primitive of ["array", "number", "string", "math"]) load(`common/primitives/${primitive}.mjs`, {});
  const operators = load("common/data/operators.mjs", {});
  const logging = { logCompatibilityWarning: () => {} };
  const helpers = load("common/utils/helpers.mjs", {
    "./color.mjs": { default: class {} }, "../data/operators.mjs": operators, "./logging.mjs": logging,
  });
  const validation = load("common/data/validation-failure.mjs", { "../utils/helpers.mjs": helpers });
  const validators = load("common/data/validators.mjs", {});
  const fields = load("common/data/fields.mjs", {
    "../constants.mjs": { ALL_DOCUMENT_TYPES: [], BASE_DOCUMENT_TYPE: "base", DOCUMENT_OWNERSHIP_LEVELS: {}, FILE_CATEGORIES: {} },
    "./validators.mjs": validators, "../utils/helpers.mjs": helpers,
    "../abstract/singleton-collection.mjs": { default: class {} },
    "../abstract/embedded-collection.mjs": { default: class {} },
    "../abstract/embedded-collection-delta.mjs": { default: class {} },
    "../utils/_module.mjs": { ...helpers, AsyncFunction: Object.getPrototypeOf(async function () {}).constructor, Color: class {} },
    "./operators.mjs": operators, "./validation-failure.mjs": validation,
  });
  const DataModel = load("common/abstract/data.mjs", {
    "../utils/helpers.mjs": helpers, "../utils/logging.mjs": logging, "../data/fields.mjs": fields,
    "../data/operators.mjs": operators, "../data/validation-failure.mjs": validation,
  }).default;
  vm.foundry = { abstract: { DataModel }, utils: helpers, data: { fields, ...validation } };
  const TypeDataModel = load("common/abstract/type-data.mjs", {
    "./data.mjs": { default: DataModel }, "../data/fields.mjs": fields,
  }).default;
  vm.foundry.abstract.TypeDataModel = TypeDataModel;
  const profile = load(join(process.cwd(), "src/core/allies/ally-profile.ts"), {});
  const { AllyDataModel } = load(join(process.cwd(), "src/features/allies/ally-data-model.ts"), {
    "../../core/allies/ally-profile": profile,
  });
  return {
    TypeDataModel, fields, AllyDataModel,
    nativeObject: (value: unknown) => runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, vm),
  };
}
