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

func resultApplySecond[T any, U any](r1 mo.Result[T], r2 mo.Result[U]) mo.Result[U] {
	if r1.IsError() {
		return mo.Err[U](r1.Error())
	} else {
		return r2
	}
}

func resultMap[T any, U any](r mo.Result[T], f func(T) U) mo.Result[U] {
	if r.IsError() {
		return mo.Err[U](r.Error())
	} else {
		return mo.Ok(f(r.MustGet()))
	}
}

func resultChain[T any, U any](r mo.Result[T], f func(T) mo.Result[U]) mo.Result[U] {
	if r.IsError() {
		return mo.Err[U](r.Error())
	} else {
		return f(r.MustGet())
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

func run(ctx *v8.Context, script string) mo.Result[string] {
	v8Result := mo.TupleToResult(ctx.RunScript(evaluateSource, "evaluate.js"))
	v8Result = resultApplySecond(v8Result, mo.TupleToResult(ctx.RunScript(script, "main.js")))
	return resultMap(v8Result, func(val *v8.Value) string {
		return val.String()
	})
}

func Evaluate(formula string, target Target) (string, error) {
	ctx := v8.NewContext(iso)
	return run(ctx, fmt.Sprintf("evaluate('%s', '%s')", formula, targetString(target))).Get()
}

type VariableConfig = struct {
	Name  string `json:"name"`
	Type  string `json:"type"`
	Value string `json:"value"`
}

func EvaluateWithVariable(formula string, target Target, variableConfigs []VariableConfig) (string, error) {
	ctx := v8.NewContext(iso)
	jsonStrResult := mo.TupleToResult(json.Marshal(variableConfigs))
	valueResult := resultChain(jsonStrResult, func(jsonStr []byte) mo.Result[*v8.Value] {
		return mo.TupleToResult(v8.JSONParse(ctx, string(jsonStr)))
	})
	return resultChain(valueResult, func(value *v8.Value) mo.Result[string] {
		global := ctx.Global()
		global.Set("variableConfigs", value)
		return run(ctx, fmt.Sprintf("evaluateWithVariables('%s', '%s', variableConfigs)", formula, targetString(target)))
	}).Get()
}
