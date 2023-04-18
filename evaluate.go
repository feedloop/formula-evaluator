package FormulaEvaluator

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/samber/mo"
	v8 "rogchap.com/v8go"
)

type Target int

const (
	Javascript Target = iota
	Postgrsql
)

//go:embed dist/evaluate.cjs
var evaluateSource string

var iso = v8.NewIsolate()

// map the value of a Result[T] to a Result[U] using the given function.
func resultMap[T any, U any](r mo.Result[T], f func(T) U) mo.Result[U] {
	if r.IsError() {
		return mo.Err[U](r.Error())
	} else {
		return mo.Ok(f(r.MustGet()))
	}
}

// chain the result of of Result[T] to a function that returns a Result[U].
func resultChain[T any, U any](r mo.Result[T], f func(T) mo.Result[U]) mo.Result[U] {
	if r.IsError() {
		return mo.Err[U](r.Error())
	} else {
		return f(r.MustGet())
	}
}

// add two results together ignoring the first result.
func resultApply[T any, U any](r1 mo.Result[T], r2 mo.Result[U]) mo.Result[U] {
	if r1.IsError() {
		return mo.Err[U](r1.Error())
	} else {
		return r2
	}
}

func targetString(target Target) string {
	switch target {
	case Javascript:
		return "javascript"
	case Postgrsql:
		return "postgresql"
	default:
		panic("unreachable")
	}
}

// sets a global variable with the given name and given parsed JSON value.
func setGlobalValue(ctx *v8.Context, name string, jsonValue string) mo.Result[*v8.Value] {
	valueResult := mo.TupleToResult(v8.JSONParse(ctx, jsonValue))
	return resultMap(valueResult, func(value *v8.Value) *v8.Value {
		global := ctx.Global()
		global.Set(name, value)
		return value
	})
}

func run(ctx *v8.Context, script string) mo.Result[string] {
	v8Result := mo.TupleToResult(ctx.RunScript(evaluateSource, "evaluate.js"))
	v8Result = resultApply(v8Result, mo.TupleToResult(ctx.RunScript(script, "main.js")))
	return resultMap(v8Result, func(val *v8.Value) string {
		return val.String()
	})
}

type VariableConfig = struct {
	Name  string `json:"name"`
	Type  string `json:"type"`
	Value string `json:"value"`
}

func Evaluate(formula string, target Target) (string, error) {
	ctx := v8.NewContext(iso)
	return run(ctx, fmt.Sprintf("evaluate('%s', '%s')", formula, targetString(target))).Get()
}

func EvaluateWithVariables(formula string, target Target, variableConfigs []VariableConfig) (string, error) {
	ctx := v8.NewContext(iso)
	jsonStrResult := mo.TupleToResult(json.Marshal(variableConfigs))
	valueResult := resultChain(jsonStrResult, func(jsonStr []byte) mo.Result[*v8.Value] {
		return setGlobalValue(ctx, "variableConfigs", string(jsonStr))
	})
	return resultApply(valueResult, run(ctx, fmt.Sprintf("evaluate('%s', '%s', variableConfigs)", formula, targetString(target)))).Get()
}

func EvaluateAST(jsonAST string, target Target) (string, error) {
	ctx := v8.NewContext(iso)
	valueResult := setGlobalValue(ctx, "ast", jsonAST)
	return resultApply(valueResult, run(ctx, fmt.Sprintf("evaluateAST(ast, '%s')", targetString(target)))).Get()
}

func EvaluateASTWithVariables(jsonAST string, target Target, variableConfigs []VariableConfig) (string, error) {
	ctx := v8.NewContext(iso)
	jsonStrResult := mo.TupleToResult(json.Marshal(variableConfigs))
	valueResult := resultChain(jsonStrResult, func(jsonStr []byte) mo.Result[*v8.Value] {
		return resultApply(setGlobalValue(ctx, "ast", jsonAST), setGlobalValue(ctx, "variableConfigs", string(jsonStr)))
	})
	return resultApply(valueResult, run(ctx, fmt.Sprintf("evaluateAST(ast, '%s', variableConfigs)", targetString(target)))).Get()
}
