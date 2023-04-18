package FormulaEvaluator

import (
	"testing"
)

func TestEvaluate(t *testing.T) {
	want := "-8"
	msg, err := Evaluate("Absolute(1 - 5) * -2", Javascript)
	if want != msg || err != nil {
		t.Fatalf("want %q, got %q, err %v", want, msg, err)
	}
}

func TestEvaluateWithVariables(t *testing.T) {
	want := "-8"
	msg, err := EvaluateWithVariables("Absolute(1 - five) * -2", Javascript, []VariableConfig{
		{
			Name:  "five",
			Type:  "number",
			Value: "5",
		},
	})
	if want != msg || err != nil {
		t.Fatalf("want %q, got %q, err %v", want, msg, err)
	}
}

func TestEvaluateAST(t *testing.T) {
	want := "-8"
	const ast = `{
  "kind": "operator",
  "name": "*",
  "unary": false,
  "start": 16,
  "end": 17,
  "left": {
    "kind": "function",
    "name": "Absolute",
    "arguments": [
      {
        "kind": "operator",
        "name": "-",
        "unary": false,
        "start": 11,
        "end": 12,
        "left": {
          "kind": "number",
          "value": 1,
          "start": 9,
          "end": 10,
          "type": "number"
        },
        "right": {
          "kind": "number",
          "value": 5,
          "start": 13,
          "end": 14,
          "type": "number"
        },
        "type": "number"
      }
    ],
    "start": 0,
    "end": 15,
    "type": "number"
  },
  "right": {
    "kind": "operator",
    "name": "-",
    "unary": true,
    "right": {
      "kind": "number",
      "value": 2,
      "start": 19,
      "end": 20,
      "type": "number"
    },
    "start": 18,
    "end": 20,
    "type": "number"
  },
  "type": "number"
}`
	msg, err := EvaluateAST(ast, Javascript)
	if want != msg || err != nil {
		t.Fatalf("want %q, got %q, err %v", want, msg, err)
	}
}

func TestEvaluateASTWithVariables(t *testing.T) {
	want := "-8"
	const ast = `{
  "kind": "operator",
  "name": "*",
  "unary": false,
  "start": 18,
  "end": 19,
  "left": {
    "kind": "function",
    "name": "Absolute",
    "arguments": [
      {
        "kind": "operator",
        "name": "-",
        "unary": false,
        "start": 11,
        "end": 12,
        "left": {
          "kind": "number",
          "value": 1,
          "start": 9,
          "end": 10,
          "type": "number"
        },
        "right": {
          "kind": "variable",
          "name": "five",
          "start": 13,
          "end": 16,
          "type": "number"
        },
        "type": "number"
      }
    ],
    "start": 0,
    "end": 17,
    "type": "number"
  },
  "right": {
    "kind": "operator",
    "name": "-",
    "unary": true,
    "right": {
      "kind": "number",
      "value": 2,
      "start": 21,
      "end": 22,
      "type": "number"
    },
    "start": 20,
    "end": 22,
    "type": "number"
  },
  "type": "number"
}`
	msg, err := EvaluateASTWithVariables(ast, Javascript, []VariableConfig{
		{
			Name:  "five",
			Type:  "number",
			Value: "5",
		},
	})
	if want != msg || err != nil {
		t.Fatalf("want %q, got %q, err %v", want, msg, err)
	}
}
