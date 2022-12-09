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
	msg, err := EvaluateWithVariable("Absolute(1 - five) * -2", Javascript, []VariableConfig{
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
