import {
  buildExpressionParser,
  FunctionEvaluatorConfig,
  FunctionGeneratorConfig,
  TypedExpression,
} from "@feedloop/expression-parser";
import { postgresConfig } from "@feedloop/formula-editor/dist/builtin";
import { mergeConfig } from "@feedloop/formula-editor/dist/mergeConfig";
import { evaluate as evaluateFormula } from "@feedloop/formula-editor/dist/evaluate";
import { Targets } from "@feedloop/formula-editor/dist/registry";
import dayjs from "dayjs";

const functionGeneratorConfigs: FunctionGeneratorConfig[] = [
  {
    name: "Max",
    description: "Maximum number of column value",
    parameters: [{ name: "column", description: "Column", type: "number" }],
    return: {
      type: "number",
    },
    examples: [],
    generate: (column: string) => `Max(${column})`,
  },
  {
    name: "Count",
    description: "Count number of rows",
    parameters: [{ name: "column", description: "Column", type: "number" }],
    return: {
      type: "number",
    },
    examples: [],
    generate: (column: string) => `Count(${column})`,
  },

  {
    name: "Point",
    description: "Returns a point from given parameters",
    examples: ["Point(102.1234, 68.1239)"],
    return: { type: "Point", description: "Point object" },
    parameters: [
      {
        name: "longitude",
        type: "number",
        description: "longitude point number",
      },
      {
        name: "latitude",
        type: "number",
        description: "latitude point number",
      },
    ],
    generate: (longitude: string, latitude: string) =>
      `'SRID=4326;POINT(${longitude} ${latitude})'`,
  },
  {
    name: "Distance",
    description: "Calculate distance between 2 points in meters",
    examples: [
      "Distance(home,school)",
      "Distance(Point(3.1234,6.12343),Point(1.2345,5.124))",
    ],
    return: { type: "number" },
    parameters: [
      { name: "point_1", type: "Point", description: "Point 1" },
      { name: "point_2", type: "Point", description: "Point 2" },
    ],
    generate: (point_1: string, point_2: string) =>
      `ST_Distance(${point_1}::geography,${point_2}::geography)`,
  },
  {
    name: "Within",
    description: "Returns whether a point is in a polygon or not",
    examples: ["Within(point,area)"],
    return: { type: "boolean" },
    parameters: [
      { name: "point", type: "Point", description: "Point" },
      { name: "area", type: "Polygon", description: "Polygon" },
    ],
    generate: (point: string, area: string) =>
      `ST_WITHIN(${point}::geometry,${area}::geometry)`,
  },
];

const functionEvaluatorConfigs: FunctionEvaluatorConfig[] = [
  {
    name: "FormatDate",
    description: "format date with given formatting tokens",
    parameters: [
      {
        name: "format",
        type: "string",
        description: "string of formatting tokens",
      },
      { name: "date", type: "date", description: "date to format" },
    ],
    return: {
      type: "string",
      description: "string formatted date",
    },
    evaluate: (format: string, date: Date) =>
      dayjs(new Date(date)).format(format),
  },
];

type VariableConfig = {
  name: string;
  type: string;
  value: string;
};

export const evaluate = (
  formula: string,
  target: Targets,
  variables: VariableConfig[] = []
) => {
  const config = mergeConfig(postgresConfig, { variables });
  const parse = buildExpressionParser(config);
  const { ast, errors } = parse(formula);
  if (errors.length > 0) {
    throw Error(errors[0].message);
  }
  return evaluateFormula(ast, target, {
    functions:
      target === "postgres"
        ? (functionGeneratorConfigs as any)
        : functionEvaluatorConfigs,
    variables: variables.map((variable) => ({
      name: variable.name,
      type: variable.type,
      generate: () => variable.value,
      evaluate: () => eval(variable.value),
    })),
  });
};

export const evaluateAST = (
  ast: TypedExpression,
  target: Targets,
  variables: VariableConfig[] = []
) =>
  evaluateFormula(ast, target, {
    functions:
      target === "postgres"
        ? (functionGeneratorConfigs as any)
        : functionEvaluatorConfigs,
    variables: variables.map((variable) => ({
      name: variable.name,
      type: variable.type,
      generate: () => variable.value,
      evaluate: () => eval(variable.value),
    })),
  });
