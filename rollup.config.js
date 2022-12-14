import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "evaluate.ts",
  output: {
    file: "dist/evaluate.cjs",
    intro: "var exports = exports || {};",
    format: "cjs",
  },
  plugins: [
    commonjs(),
    nodeResolve({
      resolveOnly: () => true,
    }),
    typescript(),
  ],
};
