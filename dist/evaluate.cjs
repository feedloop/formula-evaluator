'use strict';

var exports = exports || {};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var lib = {};

var parser = {};

var parserUtils = {};

(function (exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.generateErrorId = exports.spanned = exports.between = exports.sequence = exports.applySecond = exports.applyFirst = exports.map2 = exports.map = exports.oneOf = exports.alt = exports.sepBy = exports.many = exports.chainRec = exports.fold = exports.chain = exports.pureFail = exports.pure = exports.tryParse = exports.lookAhead = exports.lazy = exports.parse = exports.chainFail = exports.chainResult = exports.foldResult = exports.fail = exports.ok = void 0;
	var ok = function (parsed, input, position) { return ({
	    type: "ok",
	    parsed: parsed,
	    input: input,
	    position: position,
	}); };
	exports.ok = ok;
	var fail = function (expected, input, position) { return ({
	    type: "fail",
	    expected: expected,
	    input: input,
	    position: position,
	}); };
	exports.fail = fail;
	var identity = function (t) { return t; };
	var foldResult = function (result, onOk, onFail) { return (result.type === "ok" ? onOk(result) : onFail(result)); };
	exports.foldResult = foldResult;
	var chainResult = function (result, fn) { return (0, exports.foldResult)(result, fn, identity); };
	exports.chainResult = chainResult;
	var chainFail = function (result, fn) { return (0, exports.foldResult)(result, identity, fn); };
	exports.chainFail = chainFail;
	var parse = function (parser, input, position) {
	    // @ts-ignore
	    return parser.length === 0 ? parser()(input, position) : parser(input, position);
	};
	exports.parse = parse;
	var lazy = function (parser) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        return (0, exports.parse)(parser(), input, position);
	    };
	};
	exports.lazy = lazy;
	var lookAhead = function (parser) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        var result = (0, exports.parse)(parser, input, position);
	        return result.type === "ok" ? (0, exports.ok)(result.parsed, input, position) : result;
	    };
	};
	exports.lookAhead = lookAhead;
	var tryParse = function (parser) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        var result = (0, exports.parse)(parser, input, position);
	        return result.type === "fail"
	            ? (0, exports.fail)(result.expected, input, position)
	            : result;
	    };
	};
	exports.tryParse = tryParse;
	var pure = function (value) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        return (0, exports.ok)(value, input, position);
	    };
	};
	exports.pure = pure;
	var pureFail = function (expected) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        return (0, exports.fail)(expected, input, position);
	    };
	};
	exports.pureFail = pureFail;
	var chain = function (parser, fn) { return (0, exports.fold)(parser, fn, function (fail) { return (0, exports.pureFail)(fail.expected); }); };
	exports.chain = chain;
	var fold = function (parser, onOk, onFail) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        return (0, exports.foldResult)((0, exports.parse)(parser, input, position), function (ok) { return (0, exports.parse)(onOk(ok.parsed), ok.input, ok.position); }, function (fail) { return (0, exports.parse)(onFail(fail), fail.input, fail.position); });
	    };
	};
	exports.fold = fold;
	var chainRec = function (parser, rec, acc) {
	    return (0, exports.fold)(parser, function (parsed) {
	        var _a = __read(rec(parsed, acc), 2), nextParser = _a[0], nextAcc = _a[1];
	        return (0, exports.chainRec)(nextParser, rec, nextAcc);
	    }, function (fail) { return (0, exports.pure)(acc); });
	};
	exports.chainRec = chainRec;
	var many = function (parser) {
	    return (0, exports.chainRec)(parser, function (parsed, acc) { return [parser, acc.concat([parsed])]; }, []);
	};
	exports.many = many;
	var sepBy = function (parser, sep) {
	    return (0, exports.chainRec)(parser, function (parsed, acc) { return [(0, exports.applySecond)(sep, parser), acc.concat(parsed)]; }, []);
	};
	exports.sepBy = sepBy;
	var alt = function (parserA, parserB) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        return (0, exports.chainFail)((0, exports.parse)(parserA, input, position), function () {
	            return (0, exports.parse)(parserB, input, position);
	        });
	    };
	};
	exports.alt = alt;
	var oneOf = function (parsers) {
	    return parsers.reduce(function (sum, parser) { return (0, exports.alt)(sum, parser); }, (0, exports.pureFail)("one of parser"));
	};
	exports.oneOf = oneOf;
	var map = function (parser, fn) {
	    return (0, exports.chain)(parser, function (a) { return (0, exports.pure)(fn(a)); });
	};
	exports.map = map;
	var map2 = function (parserA, parserB, fn) { return (0, exports.chain)(parserA, function (a) { return (0, exports.chain)(parserB, function (b) { return (0, exports.pure)(fn(a, b)); }); }); };
	exports.map2 = map2;
	var applyFirst = function (parserA, parserB) { return (0, exports.map2)(parserA, parserB, function (a) { return a; }); };
	exports.applyFirst = applyFirst;
	var applySecond = function (parserA, parserB) { return (0, exports.map2)(parserA, parserB, function (a, b) { return b; }); };
	exports.applySecond = applySecond;
	var sequence = function (parsers) {
	    return parsers.reduce(function (sum, parser) { return (0, exports.chain)(sum, function (s) { return (0, exports.chain)(parser, function (p) { return (0, exports.pure)(s.concat(p)); }); }); }, (0, exports.pure)([]));
	};
	exports.sequence = sequence;
	var between = function (left, middle, right) { return (0, exports.applySecond)(left, (0, exports.applyFirst)(middle, right)); };
	exports.between = between;
	var spanned = function (parser) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        var result = (0, exports.parse)(parser, input, position);
	        return (0, exports.chainResult)(result, function (ok) { return (__assign(__assign({}, ok), { parsed: __assign(__assign({}, ok.parsed), { start: position, end: ok.position }) })); });
	    };
	};
	exports.spanned = spanned;
	var id = 0;
	var generateErrorId = function () { return id++; };
	exports.generateErrorId = generateErrorId;
} (parserUtils));

var suggestion = {};

var __assign$1 = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
Object.defineProperty(suggestion, "__esModule", { value: true });
suggestion.getContextAtPosition = suggestion.getSuggestionsAtPosition = void 0;
var fuzzyMatch = function (rawPattern, suggestion) {
    var pattern = rawPattern.replace(/\s/g, "").toLowerCase();
    var name = suggestion.name.replace(/\s/g, "").toLowerCase();
    if (pattern === name) {
        return Infinity;
    }
    var totalScore = pattern.split("").reduce(function (_a, patternChar) {
        var totalScore = _a.totalScore, consecutiveScore = _a.consecutiveScore, seq = _a.seq;
        var patternIndex = seq.indexOf(patternChar);
        if (patternIndex === -1)
            return { totalScore: -Infinity, consecutiveScore: 0, seq: "" };
        var score = patternIndex === 0 ? consecutiveScore * 2 + 1 : 1;
        return {
            totalScore: totalScore + score,
            consecutiveScore: score,
            seq: seq.slice(patternIndex + 1),
        };
    }, { totalScore: 0, consecutiveScore: 0, seq: name }).totalScore;
    return totalScore;
};
var getSuggestionsAtPosition = function (parserOptions, expression, cursorPosition) {
    var getFunctionSuggestions = function (leftType) {
        if (leftType === void 0) { leftType = "any"; }
        return parserOptions.functions
            .filter(function (fn) {
            return leftType === "any" ||
                fn.return.type === "any" ||
                fn.return.type === leftType;
        })
            .map(function (config) { return ({
            kind: "function",
            name: config.name,
            description: config.description,
            parameters: config.parameters,
            value: "".concat(config.name, "(").concat(config.parameters.map(function () { return ""; }).join(","), ")"),
            type: config.return.type,
            output: config.return.description,
            examples: config.examples,
            score: config.return.type === "any" ? 0 : 1,
            start: cursorPosition,
            end: cursorPosition,
        }); });
    };
    var getOperatorSuggestions = function (leftType, unary) {
        if (leftType === void 0) { leftType = "any"; }
        if (unary === void 0) { unary = false; }
        return parserOptions.operators
            .filter(function (operator) {
            return unary
                ? !("left" in operator) && operator.return.type === leftType
                : "left" in operator &&
                    (leftType === "any" ||
                        operator.left.type === "any" ||
                        operator.left.type === leftType);
        })
            .map(function (config) { return ({
            kind: "operator",
            name: config.name,
            arity: "left" in config ? "binary" : "unary",
            left: "left" in config ? config.left : undefined,
            right: config.right,
            value: config.name,
            type: config.return.type,
            output: config.return.description,
            examples: config.examples,
            score: config.return.type === "any" ? 0 : 1,
            start: cursorPosition,
            end: cursorPosition,
        }); });
    };
    var getVariableSuggestions = function (leftType) {
        if (leftType === void 0) { leftType = "any"; }
        return parserOptions.variables
            .filter(function (variable) {
            return leftType === "any" ||
                variable.type === "any" ||
                variable.type === leftType;
        })
            .map(function (config) { return ({
            kind: "variable",
            name: config.name,
            description: config.description,
            value: config.name,
            type: config.type,
            score: config.type === "any" ? 0 : 1,
            start: cursorPosition,
            end: cursorPosition,
        }); });
    };
    var getTermSuggestions = function (leftType, cursorPosition) {
        if (leftType === void 0) { leftType = "any"; }
        var functionSuggestions = getFunctionSuggestions(leftType);
        var operatorSuggestions = getOperatorSuggestions(leftType, true);
        var variableSuggestions = getVariableSuggestions(leftType);
        var booleanSuggestions = leftType === "boolean"
            ? ["true", "false"].map(function (value) { return ({
                kind: "variable",
                name: value,
                value: value,
                type: "boolean",
                score: 1,
                start: cursorPosition,
                end: cursorPosition,
            }); })
            : [];
        return functionSuggestions
            .concat(operatorSuggestions)
            .concat(variableSuggestions)
            .concat(booleanSuggestions);
    };
    var findSuggestions = function (expression, lastSuggestion) {
        if (lastSuggestion === void 0) { lastSuggestion = []; }
        switch (expression.kind) {
            case "function": {
                var config = parserOptions.functions.find(function (config) { return config.name === expression.name; });
                return cursorPosition <= expression.start
                    ? lastSuggestion
                    : cursorPosition >= expression.end
                        ? getOperatorSuggestions(config === null || config === void 0 ? void 0 : config.return.type)
                        : expression.arguments.reduce(function (last, arg) { return findSuggestions(arg, last); }, lastSuggestion);
            }
            case "operator": {
                var config = parserOptions.operators.find(function (config) { return config.name === expression.name; });
                var operatorSuggestions = getTermSuggestions((config === null || config === void 0 ? void 0 : config.return.type) || "any", cursorPosition);
                return cursorPosition <= expression.start && expression.left
                    ? findSuggestions(expression.left, lastSuggestion)
                    : (expression.right &&
                        findSuggestions(expression.right, operatorSuggestions)) ||
                        operatorSuggestions;
            }
            case "placeholder": {
                return cursorPosition < expression.start
                    ? lastSuggestion
                    : getTermSuggestions(expression.type, cursorPosition);
            }
            case "variable": {
                return getTermSuggestions(expression.type, cursorPosition)
                    .map(function (suggestion) { return (__assign$1(__assign$1({}, suggestion), { start: expression.start, score: fuzzyMatch(expression.name, suggestion) })); })
                    .map(function (suggestion) { return suggestion; })
                    .filter(function (_a) {
                    var score = _a.score;
                    return score >= 0;
                });
            }
            case "boolean":
            case "number":
                return cursorPosition <= expression.start
                    ? lastSuggestion
                    : getOperatorSuggestions(expression.kind);
            case "string":
                return cursorPosition <= expression.start
                    ? lastSuggestion
                    : cursorPosition >= expression.end
                        ? getOperatorSuggestions("string")
                        : expression.expressions.reduce(function (last, expr) { return findSuggestions(expr, last); }, lastSuggestion);
            case "expression": {
                return cursorPosition <= expression.start
                    ? lastSuggestion
                    : findSuggestions(expression.expression);
            }
        }
    };
    return (findSuggestions(expression)
        // TODO: add option to show operator suggestions
        .filter(function (suggestion) { return suggestion.kind !== "operator"; })
        .sort(function (a, b) { return a.name.localeCompare(b.name); })
        .sort(function (a, b) { return b.score - a.score; }));
};
suggestion.getSuggestionsAtPosition = getSuggestionsAtPosition;
var getContextAtPosition = function (parserOptions, expression, cursorPosition) {
    var getContext = function (expression) {
        switch (expression.kind) {
            case "function": {
                if (cursorPosition > expression.end ||
                    cursorPosition < expression.start)
                    return null;
                var context = expression.arguments.reduce(function (context, arg) { return context || getContext(arg); }, null);
                if (context)
                    return context;
                var index = expression.arguments.findIndex(function (arg) { return arg.start <= cursorPosition && arg.end >= cursorPosition; });
                var config = parserOptions.functions.find(function (fn) {
                    return fn.name === expression.name &&
                        fn.parameters.every(function (param, i) { var _a; return param.type === ((_a = expression.arguments[i]) === null || _a === void 0 ? void 0 : _a.type); });
                }) ||
                    parserOptions.functions.find(function (fn) { return fn.name === expression.name; });
                var functionContext = config && {
                    kind: "function",
                    name: config.name,
                    type: config.return.type,
                    description: config.description,
                    output: config.return.description,
                    parameters: config.parameters,
                    examples: config.examples,
                };
                return config && functionContext
                    ? config.parameters[index]
                        ? __assign$1(__assign$1({}, functionContext), { kind: "parameter", description: config.parameters[index].description, index: index }) : functionContext
                    : null;
            }
            case "operator": {
                return cursorPosition > expression.end
                    ? (expression.right && getContext(expression.right)) || null
                    : cursorPosition < expression.start
                        ? (expression.left && getContext(expression.left)) || null
                        : null;
            }
            case "variable": {
                var config = parserOptions.variables.find(function (variable) { return variable.name === expression.name; });
                return config
                    ? {
                        kind: "variable",
                        name: config.name,
                        type: config.type,
                        description: config.description,
                    }
                    : null;
            }
            case "expression":
                return getContext(expression.expression);
            case "string":
                return expression.expressions.reduce(function (context, arg) { return context || getContext(arg); }, null);
            default:
                return null;
        }
    };
    return getContext(expression);
};
suggestion.getContextAtPosition = getContextAtPosition;

var typeChecker = {};

var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(typeChecker, "__esModule", { value: true });
typeChecker.buildTypeChecker = void 0;
var parser_utils_1 = parserUtils;
var buildTypeChecker = function (options) {
    var castableToStringTypes = options.functions
        .filter(function (fn) {
        return fn.name === "String" &&
            fn.parameters.length === 1 &&
            fn.return.type === "string";
    })
        .map(function (fn) { return fn.parameters[0].type; });
    var checkType = function (expression, type) {
        var isCastableToString = function (expressionType) {
            return type === "string" && castableToStringTypes.includes(expressionType);
        };
        var start = expression.start, end = expression.end;
        switch (expression.kind) {
            case "function": {
                var configs = options.functions.filter(function (config) { return config.name === expression.name; });
                var config = configs.find(function (config) {
                    return config.parameters.find(function (param, i) {
                        return !!expression.arguments[i] &&
                            checkType(expression.arguments[i], param.type)[1].length === 0;
                    });
                }) || configs[0];
                var functionErrors = config
                    ? type === "any" ||
                        config.return.type === "any" ||
                        type === config.return.type ||
                        isCastableToString(config.return.type)
                        ? []
                        : [
                            {
                                id: (0, parser_utils_1.generateErrorId)(),
                                start: start,
                                end: end,
                                message: "expected return type of ".concat(type, " but got ").concat(config.return.type),
                            },
                        ]
                    : [
                        {
                            id: (0, parser_utils_1.generateErrorId)(),
                            start: start,
                            end: start + expression.name.length,
                            message: "function ".concat(expression.name, " is not defined"),
                        },
                    ];
                var _a = __read(((config === null || config === void 0 ? void 0 : config.parameters) || []).reduce(function (_a, param, i) {
                    var _b = __read(_a, 2), sumArgs = _b[0], sumErrs = _b[1];
                    var argument = expression.arguments[i];
                    if (!argument)
                        return [
                            sumArgs,
                            sumErrs.concat({
                                start: expression.end - 1,
                                end: expression.end - 1,
                                id: (0, parser_utils_1.generateErrorId)(),
                                message: "missing parameter ".concat(param.name, " of type ").concat(param.type),
                            }),
                        ];
                    var _c = __read(checkType(argument, param.type), 2), typedArg = _c[0], errors = _c[1];
                    return [sumArgs.concat(typedArg), sumErrs.concat(errors)];
                }, [[], []]), 2), args = _a[0], argumentErrors = _a[1];
                return [
                    __assign(__assign({}, expression), { arguments: args, type: (config === null || config === void 0 ? void 0 : config.return.type) || type }),
                    functionErrors.concat(argumentErrors.flat()),
                ];
            }
            case "operator": {
                var operators = options.operators.filter(function (config) {
                    return config.name === expression.name &&
                        !!expression.left === "left" in config;
                });
                var config = (expression.left
                    ? operators.find(function (config) {
                        return "left" in config &&
                            !!expression.left &&
                            !!expression.right &&
                            checkType(expression.left, config.left.type)[1].length ===
                                0 &&
                            checkType(expression.right, config.right.type)[1].length === 0;
                    })
                    : operators.find(function (config) {
                        return !!expression.right &&
                            checkType(expression.right, config.right.type)[1].length === 0;
                    }) ||
                        operators.find(function (config) { return !("left" in config); })) || operators[0];
                var operatorErrors = config
                    ? type === "any" ||
                        config.return.type === "any" ||
                        type === config.return.type ||
                        isCastableToString(config.return.type)
                        ? []
                        : [
                            {
                                id: (0, parser_utils_1.generateErrorId)(),
                                start: start,
                                end: end,
                                message: "expected operator type of ".concat(type, " but got ").concat(config.return.type),
                            },
                        ]
                    : [
                        {
                            id: (0, parser_utils_1.generateErrorId)(),
                            start: start,
                            end: start + expression.name.length,
                            message: "operator ".concat(expression.name, " is not defined"),
                        },
                    ];
                var _b = __read(config && "left" in config
                    ? expression.left
                        ? checkType(expression.left, config.left.type)
                        : [
                            undefined,
                            {
                                id: (0, parser_utils_1.generateErrorId)(),
                                start: start,
                                end: end,
                                message: "expected a term before the operator",
                            },
                        ]
                    : [undefined, []], 2), left = _b[0], leftErrors = _b[1];
                var _c = __read(config
                    ? expression.right
                        ? checkType(expression.right, config.right.type)
                        : [
                            undefined,
                            {
                                id: (0, parser_utils_1.generateErrorId)(),
                                start: start,
                                end: end,
                                message: "expected a term after the operator",
                            },
                        ]
                    : [undefined, []], 2), right = _c[0], rightErrors = _c[1];
                return [
                    __assign(__assign({}, expression), { left: left, right: right, type: (config === null || config === void 0 ? void 0 : config.return.type) || type }),
                    operatorErrors.concat(leftErrors, rightErrors),
                ];
            }
            case "variable": {
                var config = options.variables.find(function (config) { return config.name === expression.name; });
                return config
                    ? type === "any" ||
                        config.type === "any" ||
                        type === config.type ||
                        isCastableToString(config.type)
                        ? [__assign(__assign({}, expression), { type: config.type }), []]
                        : [
                            __assign(__assign({}, expression), { type: config.type }),
                            [
                                {
                                    id: (0, parser_utils_1.generateErrorId)(),
                                    start: start,
                                    end: end,
                                    message: "expected type of ".concat(type, " but got ").concat(config.type),
                                },
                            ],
                        ]
                    : [
                        __assign(__assign({}, expression), { type: type }),
                        [
                            {
                                id: (0, parser_utils_1.generateErrorId)(),
                                start: start,
                                end: start + expression.name.length,
                                message: "variable ".concat(expression.name, " is not defined"),
                            },
                        ],
                    ];
            }
            case "placeholder":
                return [
                    __assign(__assign({}, expression), { errorID: (0, parser_utils_1.generateErrorId)(), type: type }),
                    [
                        {
                            id: (0, parser_utils_1.generateErrorId)(),
                            start: start,
                            end: end,
                            message: "expected type of ".concat(type),
                        },
                    ],
                ];
            case "expression": {
                var _d = __read(checkType(expression.expression, type), 2), typedExpression = _d[0], errors_1 = _d[1];
                return [__assign(__assign({}, expression), { expression: typedExpression, type: type }), errors_1];
            }
            case "boolean":
            case "number":
                return [
                    __assign(__assign({}, expression), { type: expression.kind }),
                    type === "any" ||
                        type === expression.kind ||
                        isCastableToString(expression.kind)
                        ? []
                        : [
                            {
                                id: (0, parser_utils_1.generateErrorId)(),
                                start: start,
                                end: end,
                                message: "expected type of ".concat(type),
                            },
                        ],
                ];
            case "string":
                var _e = __read(expression.expressions.reduce(function (_a, expression) {
                    var _b = __read(_a, 2), typedExpressions = _b[0], errors = _b[1];
                    var _c = __read(checkType(expression, "string"), 2), typedExpression = _c[0], error = _c[1];
                    return [
                        typedExpressions.concat(typedExpression),
                        errors.concat(error),
                    ];
                }, [[], []]), 2), typedExpressions = _e[0], errors = _e[1];
                return [
                    __assign(__assign({}, expression), { expressions: typedExpressions, type: "string" }),
                    type === "any" || type === "string"
                        ? errors
                        : [
                            {
                                id: (0, parser_utils_1.generateErrorId)(),
                                start: start,
                                end: end,
                                message: "expected type of ".concat(type),
                            },
                        ].concat(errors),
                ];
        }
    };
    return checkType;
};
typeChecker.buildTypeChecker = buildTypeChecker;

(function (exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.buildExpressionParser = exports.buildExpressionSyntaxParser = exports.lexeme = exports.nonspaces = exports.spaces = exports.boolean = exports.number = exports.eof = exports.text = exports.regex = void 0;
	var parser_utils_1 = parserUtils;
	var suggestion_1 = suggestion;
	var type_checker_1 = typeChecker;
	var regex = function (regex) {
	    var anchoredRegex = new RegExp("^".concat(regex.source));
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        var match = anchoredRegex.exec(input.slice(position));
	        if (match !== null) {
	            var matchedText = match[0];
	            return (0, parser_utils_1.ok)(matchedText, input, position + matchedText.length);
	        }
	        return (0, parser_utils_1.fail)(regex.toString(), input, position);
	    };
	};
	exports.regex = regex;
	var text = function (text) {
	    return function (input, position) {
	        if (position === void 0) { position = 0; }
	        return input.slice(position).startsWith(text)
	            ? (0, parser_utils_1.ok)(text, input, position + text.length)
	            : (0, parser_utils_1.fail)("\"".concat(text, "\""), input, position);
	    };
	};
	exports.text = text;
	var eof = function (input, position) {
	    if (position === void 0) { position = 0; }
	    return input.slice(position).length === 0
	        ? (0, parser_utils_1.ok)("", input, position)
	        : (0, parser_utils_1.fail)("\"end of input\"", input, position);
	};
	exports.eof = eof;
	var number = function (input, position) {
	    if (position === void 0) { position = 0; }
	    var match = /^\d+(\.\d+)?/.exec(input.slice(position));
	    if (match !== null) {
	        var matchedText = match[0];
	        return (0, parser_utils_1.ok)(Number(matchedText), input, position + matchedText.length);
	    }
	    return (0, parser_utils_1.fail)("number", input, position);
	};
	exports.number = number;
	exports.boolean = (0, parser_utils_1.oneOf)([
	    (0, parser_utils_1.map)((0, exports.text)("true"), function () { return true; }),
	    (0, parser_utils_1.map)((0, exports.text)("false"), function () { return false; }),
	    (0, parser_utils_1.pureFail)("boolean"),
	]);
	exports.spaces = (0, exports.regex)(/\s*/);
	exports.nonspaces = (0, exports.regex)(/[^\s"`,(){}/\\]+/);
	var lexeme = function (parser) {
	    return (0, parser_utils_1.between)(exports.spaces, parser, exports.spaces);
	};
	exports.lexeme = lexeme;
	var buildExpressionSyntaxParser = function (operatorConfigs) {
	    var binaryOperator = (0, parser_utils_1.map)((0, parser_utils_1.oneOf)(operatorConfigs
	        .filter(function (config) { return "left" in config; })
	        .map(function (config) { return (0, exports.text)(config.name); })
	        .concat(exports.nonspaces)), function (name) { return ({
	        kind: "operator",
	        name: name,
	        unary: false,
	    }); });
	    var unaryOperator = (0, parser_utils_1.map2)((0, parser_utils_1.oneOf)(operatorConfigs
	        .filter(function (config) { return !("left" in config); })
	        .map(function (config) { return (0, exports.text)(config.name); })), (0, parser_utils_1.alt)((0, exports.lexeme)(termParser), (0, parser_utils_1.applySecond)(exports.eof, (0, parser_utils_1.spanned)((0, parser_utils_1.pure)({ kind: "placeholder" })))), function (name, right) { return ({
	        kind: "operator",
	        name: name,
	        unary: true,
	        right: right,
	    }); });
	    var functionParser = (0, parser_utils_1.map2)(exports.nonspaces, (0, parser_utils_1.between)((0, exports.text)("("), (0, parser_utils_1.sepBy)((0, exports.lexeme)(expression), (0, exports.text)(",")), (0, exports.text)(")")), function (name, args) { return ({
	        kind: "function",
	        name: name,
	        arguments: args,
	    }); });
	    var subExpression = (0, parser_utils_1.map)((0, parser_utils_1.between)((0, exports.text)("("), (0, exports.lexeme)(expression), (0, exports.text)(")")), function (expression) { return ({ kind: "expression", expression: expression }); });
	    var stringPart = (0, parser_utils_1.spanned)((0, parser_utils_1.map)((0, exports.regex)(/.*?(?=\"|\{\{)/), function (value) { return ({ value: value }); }));
	    var string = (0, parser_utils_1.between)((0, exports.text)('"'), (0, parser_utils_1.map2)(stringPart, (0, parser_utils_1.many)((0, parser_utils_1.map2)((0, parser_utils_1.between)((0, exports.text)("{{"), (0, exports.lexeme)(expression), (0, exports.text)("}}")), stringPart, function (expression, part) { return [
	        expression,
	        part,
	    ]; })), function (part, expressionAndParts) {
	        return expressionAndParts.reduce(function (string, _a) {
	            var _b = __read(_a, 2), expression = _b[0], part = _b[1];
	            return ({
	                kind: "string",
	                expressions: string.expressions.concat(expression),
	                parts: string.parts.concat(part),
	            });
	        }, {
	            kind: "string",
	            expressions: [],
	            parts: [part],
	        });
	    }), (0, exports.text)('"'));
	    function termParser() {
	        return (0, parser_utils_1.spanned)((0, parser_utils_1.oneOf)([
	            functionParser,
	            subExpression,
	            unaryOperator,
	            string,
	            (0, parser_utils_1.map)(exports.number, function (value) { return ({ kind: "number", value: value }); }),
	            (0, parser_utils_1.map)(exports.boolean, function (value) { return ({ kind: "boolean", value: value }); }),
	            (0, parser_utils_1.map)(exports.nonspaces, function (name) { return ({ kind: "variable", name: name }); }),
	        ]));
	    }
	    var operatorPrecedenceGroup = __spreadArray([], __read(operatorConfigs
	        .filter(function (config) { return "left" in config; })
	        .reduce(function (group, operatorConfig) {
	        var _a;
	        return group.set(operatorConfig.precedence, ((_a = group.get(operatorConfig.precedence)) === null || _a === void 0 ? void 0 : _a.concat(operatorConfig)) || [
	            operatorConfig,
	        ]);
	    }, new Map())
	        .entries()), false).sort(function (a, b) { return a[0] - b[0]; });
	    var reorderTerms = function (termsAndOperators) {
	        var firstValidOperatorIndex = operatorPrecedenceGroup.reduce(function (operator, _a) {
	            var _b = __read(_a, 2), group = _b[1];
	            return operator === -1
	                ? termsAndOperators.findIndex(function (to) {
	                    return to.kind === "operator" &&
	                        !to.unary &&
	                        group.map(function (op) { return op.name; }).includes(to.name);
	                })
	                : operator;
	        }, -1);
	        var firstOpIndex = firstValidOperatorIndex !== -1
	            ? firstValidOperatorIndex
	            : termsAndOperators.findIndex(function (to) { return to.kind === "operator" && !to.unary; });
	        if (firstOpIndex === -1) {
	            return termsAndOperators[0];
	        }
	        var leftTermsAndOperators = termsAndOperators.slice(0, firstOpIndex);
	        var _a = __read(termsAndOperators.slice(firstOpIndex)), op = _a[0], rightTermsAndOperators = _a.slice(1);
	        if (!(op.kind === "operator" && !op.unary)) {
	            throw Error("expecting an operator but got ".concat(op.kind));
	        }
	        return __assign(__assign({}, op), { left: reorderTerms(leftTermsAndOperators), right: reorderTerms(rightTermsAndOperators) });
	    };
	    function expression() {
	        return (0, parser_utils_1.chain)((0, parser_utils_1.chainRec)(termParser, function (expression, expressions) { return [
	            (0, exports.lexeme)(!(expression.kind === "operator" && !expression.unary)
	                ? (0, parser_utils_1.spanned)(binaryOperator)
	                : termParser),
	            expressions.concat(expression),
	        ]; }, []), function (terms) {
	            return terms.length
	                ? (0, parser_utils_1.pure)(reorderTerms(terms))
	                : (0, parser_utils_1.spanned)((0, parser_utils_1.pure)({ kind: "placeholder" }));
	        });
	    }
	    return function (input) { return (0, parser_utils_1.parse)((0, parser_utils_1.applyFirst)(expression, exports.eof), input, 0); };
	};
	exports.buildExpressionSyntaxParser = buildExpressionSyntaxParser;
	var buildExpressionParser = function (options) {
	    var syntaxParser = (0, exports.buildExpressionSyntaxParser)(options.operators);
	    var typeChecker = (0, type_checker_1.buildTypeChecker)(options);
	    return function (input, cursorPosition) {
	        if (cursorPosition === void 0) { cursorPosition = input.length; }
	        var parseResult = syntaxParser(input);
	        if (parseResult.type === "fail") {
	            var id = (0, parser_utils_1.generateErrorId)();
	            return {
	                ast: {
	                    kind: "placeholder",
	                    start: 0,
	                    end: 0,
	                    type: "any",
	                    errorID: id,
	                },
	                errors: [
	                    {
	                        id: id,
	                        start: parseResult.position,
	                        end: parseResult.input.length - parseResult.position,
	                        message: "expecting ".concat(parseResult.expected, " but got ").concat(parseResult.input.slice(parseResult.position)),
	                    },
	                ],
	                suggestions: [],
	                context: null,
	            };
	        }
	        var _a = __read(typeChecker(parseResult.parsed, options.type || "any"), 2), typedAst = _a[0], errors = _a[1];
	        return {
	            ast: typedAst,
	            errors: errors.concat(parseResult.input.slice(parseResult.position)
	                ? [
	                    {
	                        id: (0, parser_utils_1.generateErrorId)(),
	                        start: parseResult.position,
	                        end: parseResult.input.length - parseResult.position,
	                        message: "cannot parse ".concat(parseResult.input.slice(parseResult.position)),
	                    },
	                ]
	                : []),
	            suggestions: (0, suggestion_1.getSuggestionsAtPosition)(options, typedAst, cursorPosition),
	            context: (0, suggestion_1.getContextAtPosition)(options, typedAst, cursorPosition),
	        };
	    };
	};
	exports.buildExpressionParser = buildExpressionParser;
} (parser));

var evaluator = {};

(function (exports) {
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.evaluate = void 0;
	var evaluate = function (expression, configs, stringify) {
	    if (stringify === void 0) { stringify = false; }
	    var toString = function (type, value) {
	        var toStringConfig = configs.functions.find(function (fn) {
	            return fn.name === "String" &&
	                fn.parameters.length === 1 &&
	                fn.parameters[0].type === type &&
	                fn.return.type === "string";
	        });
	        return toStringConfig
	            ? toStringConfig.evaluate(value)
	            : JSON.stringify(value);
	    };
	    var evaluate_ = function (expression) {
	        switch (expression.kind) {
	            case "function": {
	                var functionConfigs = configs.functions.filter(function (config) { return config.name === expression.name; });
	                var config_1 = functionConfigs.find(function (config) {
	                    return config.parameters.every(function (param, i) { return expression.arguments[i].type === param.type; });
	                }) || functionConfigs[0];
	                if (!config_1) {
	                    throw Error("can't find config for function ".concat(expression.name));
	                }
	                return config_1.evaluate.apply(config_1, __spreadArray([], __read(expression.arguments.map(function (arg, i) {
	                    return (0, exports.evaluate)(arg, configs, config_1.parameters[i].type === "string");
	                })), false));
	            }
	            case "operator": {
	                var operatorConfigs = configs.operators.filter(function (op) { return op.name === expression.name; });
	                var config = operatorConfigs.find(function (config) {
	                    var _a, _b;
	                    return (!("left" in config) ||
	                        ((_a = expression.left) === null || _a === void 0 ? void 0 : _a.type) === config.left.type) &&
	                        ((_b = expression.right) === null || _b === void 0 ? void 0 : _b.type) === config.right.type;
	                }) || operatorConfigs[0];
	                if (!config) {
	                    throw Error("can't find config for operator ".concat(expression.name));
	                }
	                if (!expression.right) {
	                    throw Error("ParseError: expected a term after the operator");
	                }
	                return config.evaluate.apply(config, __spreadArray([], __read(("left" in config
	                    ? [
	                        [config.left.type, expression.left],
	                        [config.right.type, expression.right],
	                    ]
	                    : [[config.right.type, expression.right]])
	                    .filter(function (exp) { return Boolean(exp[1]); })
	                    .map(function (_a) {
	                    var _b = __read(_a, 2), type = _b[0], exp = _b[1];
	                    return (0, exports.evaluate)(exp, configs, type === "string");
	                })), false));
	            }
	            case "variable": {
	                var config = configs.variables.find(function (variable) { return variable.name === expression.name; });
	                if (!config) {
	                    throw Error("can't find config for operator ".concat(expression.name));
	                }
	                return config.evaluate();
	            }
	            case "expression":
	                return (0, exports.evaluate)(expression.expression, configs);
	            case "boolean":
	            case "number":
	                return expression.value;
	            case "string": {
	                var concatFn_1 = configs.functions.find(function (fn) {
	                    return fn.name === "Concatenate" &&
	                        fn.parameters.every(function (param) { return param.type === "string"; }) &&
	                        fn.return.type === "string";
	                });
	                return expression.parts.slice(1).reduce(function (string, part, i) {
	                    var concat = concatFn_1
	                        ? concatFn_1.evaluate.bind(null, string)
	                        : string.concat.bind(string);
	                    return concat((0, exports.evaluate)(expression.expressions[i], configs, true), part.value);
	                }, expression.parts[0].value);
	            }
	        }
	    };
	    var value = evaluate_(expression);
	    return stringify && expression.type !== "string"
	        ? toString(expression.type, value)
	        : value;
	};
	exports.evaluate = evaluate;
} (evaluator));

var generator = {};

(function (exports) {
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.generate = void 0;
	var type_checker_1 = typeChecker;
	var generate = function (expression, configs) {
	    var checkType = (0, type_checker_1.buildTypeChecker)(configs);
	    switch (expression.kind) {
	        case "function": {
	            var functionConfigs = configs.functions.filter(function (config) { return config.name === expression.name; });
	            var fn = functionConfigs.find(function (config) {
	                return config.parameters.every(function (param, i) {
	                    return checkType(expression.arguments[i], param.type)[1].length === 0;
	                });
	            }) || functionConfigs[0];
	            var argsString = expression.arguments.map(function (arg) {
	                return (0, exports.generate)(arg, configs);
	            });
	            return (fn === null || fn === void 0 ? void 0 : fn.generate)
	                ? fn.generate.apply(fn, __spreadArray([], __read(argsString), false)) : "".concat(expression.name, "(").concat(argsString.join(","), ")");
	        }
	        case "operator": {
	            var operatorConfigs = configs.operators.filter(function (op) { return op.name === expression.name; });
	            var op = operatorConfigs.find(function (config) {
	                var _a, _b;
	                return (!("left" in config) ||
	                    ((_a = expression.left) === null || _a === void 0 ? void 0 : _a.type) === config.left.type) &&
	                    ((_b = expression.right) === null || _b === void 0 ? void 0 : _b.type) === config.right.type;
	            }) || operatorConfigs[0];
	            var argsString = [expression.left, expression.right]
	                .filter(function (exp) { return Boolean(exp); })
	                .map(function (arg) { return (0, exports.generate)(arg, configs); });
	            return (op === null || op === void 0 ? void 0 : op.generate)
	                ? op.generate.apply(op, __spreadArray([], __read(argsString), false)) : argsString.length === 1
	                ? "".concat(expression.name, " ").concat(argsString[0])
	                : argsString.join(" ".concat(expression.name, " "));
	        }
	        case "variable": {
	            var variable = configs.variables.find(function (variable) { return variable.name === expression.name; });
	            return (variable === null || variable === void 0 ? void 0 : variable.generate) ? variable.generate() : expression.name;
	        }
	        case "boolean":
	        case "number":
	            return "".concat(expression.value);
	        case "string": {
	            var concatFn_1 = configs.functions.find(function (fn) {
	                return fn.name === "Concatenate" &&
	                    fn.parameters.every(function (param) { return param.type === "string"; }) &&
	                    fn.return.type === "string";
	            });
	            return (concatFn_1 === null || concatFn_1 === void 0 ? void 0 : concatFn_1.generate)
	                ? expression.parts
	                    .slice(0, -1)
	                    .map(function (part, i) { return [
	                    part.value,
	                    (0, exports.generate)(expression.expressions[i], configs),
	                ]; })
	                    .reverse()
	                    .reduce(function (prevPart, _a) {
	                    var _b;
	                    var _c = __read(_a, 2), part = _c[0], expr = _c[1];
	                    return ((_b = concatFn_1.generate) === null || _b === void 0 ? void 0 : _b.call(concatFn_1, "'".concat(part, "'"), concatFn_1.generate(expr, prevPart))) || prevPart;
	                }, "'".concat(expression.parts[expression.parts.length - 1].value, "'"))
	                : "\"".concat(expression.parts
	                    .slice(1)
	                    .reduce(function (string, part, i) {
	                    return string.concat("{{".concat((0, exports.generate)(expression.expressions[i], configs), "}}"), "".concat(part.value));
	                }, "".concat(expression.parts[0].value)), "\"");
	        }
	        case "expression":
	            return "(".concat((0, exports.generate)(expression.expression, configs), ")");
	        case "placeholder":
	            return "";
	    }
	};
	exports.generate = generate;
} (generator));

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.generate = exports.evaluate = exports.buildExpressionParser = exports.buildExpressionSyntaxParser = void 0;
	var parser_1 = parser;
	Object.defineProperty(exports, "buildExpressionSyntaxParser", { enumerable: true, get: function () { return parser_1.buildExpressionSyntaxParser; } });
	Object.defineProperty(exports, "buildExpressionParser", { enumerable: true, get: function () { return parser_1.buildExpressionParser; } });
	var evaluator_1 = evaluator;
	Object.defineProperty(exports, "evaluate", { enumerable: true, get: function () { return evaluator_1.evaluate; } });
	var generator_1 = generator;
	Object.defineProperty(exports, "generate", { enumerable: true, get: function () { return generator_1.generate; } });
} (lib));

var src = {};

var Builder$1 = {};

Object.defineProperty(Builder$1, "__esModule", { value: true });
Builder$1.Builder = void 0;
function Builder(typeOrTemplate, template) {
    let type;
    if (typeOrTemplate instanceof Function) {
        type = typeOrTemplate;
    }
    else {
        template = typeOrTemplate;
    }
    const built = template ? Object.assign({}, template) : {};
    const builder = new Proxy({}, {
        get(target, prop) {
            if ('build' === prop) {
                if (type) {
                    // A class name (identified by the constructor) was passed. Instantiate it with props.
                    const obj = new type();
                    return () => Object.assign(obj, Object.assign({}, built));
                }
                else {
                    // No type information - just return the object.
                    return () => built;
                }
            }
            return (x) => {
                built[prop.toString()] = x;
                return builder;
            };
        }
    });
    return builder;
}
Builder$1.Builder = Builder;

var StrictBuilder$1 = {};

Object.defineProperty(StrictBuilder$1, "__esModule", { value: true });
StrictBuilder$1.StrictBuilder = void 0;
/**
 * Create a StrictBuilder for an interface. Returned objects will be untyped.
 *
 * e.g. let obj: Interface = StrictBuilder<Interface>().setA(5).setB("str").build();
 *
 */
function StrictBuilder() {
    const built = {};
    const Strictbuilder = new Proxy({}, {
        get(target, prop) {
            if ('build' === prop) {
                return () => built;
            }
            return (x) => {
                built[prop.toString()] = x;
                return Strictbuilder;
            };
        }
    });
    return Strictbuilder;
}
StrictBuilder$1.StrictBuilder = StrictBuilder;

(function (exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(Builder$1, exports);
	__exportStar(StrictBuilder$1, exports);
	
} (src));

class Registry {
    constructor() {
        this.configs = {
            function: new Map(),
            variable: new Map(),
            operator: new Map(),
        };
    }
    define(type, define) {
        var _a;
        const functionBuilder = src.StrictBuilder();
        const config = define(functionBuilder).build();
        this.configs[type].set(config.name.concat(
        // @ts-ignore
        config.parameters
            ? // @ts-ignore
                config.parameters.map((param) => param.type).join("")
            : // @ts-ignore
                config.right
                    ? // @ts-ignore
                        config.right.type.concat((_a = config.left) === null || _a === void 0 ? void 0 : _a.type)
                    : ""), 
        // @ts-ignore
        config);
        return config;
    }
}
var registry = new Registry();

registry.define("operator", (fn) => fn
    .name("+")
    .examples(["2 + 3"])
    .return({ type: "number" })
    // @ts-ignore
    .left({ name: "number", type: "number" })
    .right({ name: "number", type: "number" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} + ${right}`,
    javascript: (left, right) => left + right,
}));

registry.define("operator", (fn) => fn
    .name("-")
    .examples(["2 - 3"])
    .return({ type: "number" })
    // @ts-ignore
    .left({ name: "number", type: "number" })
    .right({ name: "number", type: "number" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} - ${right}`,
    javascript: (left, right) => left - right,
}));

registry.define("operator", (fn) => fn
    .name("*")
    .examples(["2 * 3"])
    .return({ type: "number" })
    // @ts-ignore
    .left({ name: "number", type: "number" })
    .right({ name: "number", type: "number" })
    .precedence(2)
    .interpret({
    postgres: (left, right) => `${left} * ${right}`,
    javascript: (left, right) => left * right,
}));

registry.define("operator", (fn) => fn
    .name("/")
    .examples(["2 / 3"])
    .return({ type: "number" })
    // @ts-ignore
    .left({ name: "number", type: "number" })
    .right({ name: "number", type: "number" })
    .precedence(2)
    .interpret({
    postgres: (left, right) => `${left} / ${right}`,
    javascript: (left, right) => left / right,
}));

registry.define("operator", (fn) => fn
    .name("&&")
    .examples(["2 && 3"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "boolean", type: "boolean" })
    .right({ name: "boolean", type: "boolean" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} AND ${right}`,
    javascript: (left, right) => left && right,
}));

registry.define("operator", (fn) => fn
    .name("||")
    .examples(["2 || 3"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "boolean", type: "boolean" })
    .right({ name: "boolean", type: "boolean" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} OR ${right}`,
    javascript: (left, right) => left || right,
}));

registry.define("operator", (fn) => fn
    .name("!")
    .examples([])
    .return({ type: "boolean" })
    .right({ name: "boolean", type: "boolean" })
    .interpret({
    postgres: (right) => `!${right}`,
    javascript: (right) => !right,
}));

registry.define("operator", (fn) => fn
    .name("==")
    .examples(["3 == 3"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "boolean", type: "any" })
    .right({ name: "boolean", type: "any" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} = ${right}`,
    javascript: (left, right) => left === right,
}));

registry.define("operator", (fn) => fn
    .name("!=")
    .examples(["3 != 4"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "boolean", type: "any" })
    .right({ name: "boolean", type: "any" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} != ${right}`,
    javascript: (left, right) => left !== right,
}));

registry.define("operator", (fn) => fn
    .name("-")
    .examples([])
    .return({ type: "number" })
    .right({ name: "number", type: "number" })
    .interpret({
    postgres: (right) => `-${right}`,
    javascript: (right) => right * -1,
}));

registry.define("operator", (fn) => fn
    .name("contains")
    .examples(['"Hello world" contains "world"'])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "string", type: "string" })
    .right({ name: "string", type: "string" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} LIKE '%' || ${right} || '%'`,
    javascript: (left, right) => left.includes(right),
}));

registry.define("operator", (fn) => fn
    .name("<=")
    .examples(["5 <= 5"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "number", type: "number" })
    .right({ name: "number", type: "number" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} <= ${right}`,
    javascript: (left, right) => left <= right,
}));

registry.define("operator", (fn) => fn
    .name("<=")
    .examples(["5 <= 5"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "date", type: "date" })
    .right({ name: "date", type: "date" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} <= ${right}`,
    javascript: (left, right) => left.getTime() <= right.getTime(),
}));

registry.define("operator", (fn) => fn
    .name("<")
    .examples(["3 < 5"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "number", type: "number" })
    .right({ name: "number", type: "number" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} < ${right}`,
    javascript: (left, right) => left < right,
}));

registry.define("operator", (fn) => fn
    .name("<")
    .examples(["3 < 5"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "date", type: "date" })
    .right({ name: "date", type: "date" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} < ${right}`,
    javascript: (left, right) => left.getTime() < right.getTime(),
}));

registry.define("operator", (fn) => fn
    .name(">=")
    .examples(["5 >= 5"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "number", type: "number" })
    .right({ name: "number", type: "number" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} >= ${right}`,
    javascript: (left, right) => left >= right,
}));

registry.define("operator", (fn) => fn
    .name(">=")
    .examples(["5 >= 5"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "date", type: "date" })
    .right({ name: "date", type: "date" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} >= ${right}`,
    javascript: (left, right) => left.getTime() >= right.getTime(),
}));

registry.define("operator", (fn) => fn
    .name(">")
    .examples(["8 > 5"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "number", type: "number" })
    .right({ name: "number", type: "number" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} > ${right}`,
    javascript: (left, right) => left > right,
}));

registry.define("operator", (fn) => fn
    .name(">")
    .examples(["8 > 5"])
    .return({ type: "boolean" })
    // @ts-ignore
    .left({ name: "date", type: "date" })
    .right({ name: "date", type: "date" })
    .precedence(1)
    .interpret({
    postgres: (left, right) => `${left} > ${right}`,
    javascript: (left, right) => left.getTime() > right.getTime(),
}));

registry.define("function", (fn) => fn
    .name("Absolute")
    .description("returns the absolute value of a given integer")
    .examples(["Absolute(-2)"])
    .parameters([{ name: "number", type: "number" }])
    .return({ type: "number" })
    .interpret({
    postgres: (num) => `Absolute(${num})`,
    javascript: (num) => Math.abs(num),
}));

registry.define("function", (fn) => fn
    .name("Ceiling")
    .description("returns nearest number that equals or lower than the argument")
    .examples(["Ceiling(3.14)"])
    .parameters([{ name: "number", type: "number" }])
    .return({ type: "number" })
    .interpret({
    postgres: (num) => `Ceiling(${num})`,
    javascript: (num) => Math.ceil(num),
}));

registry.define("function", (fn) => fn
    .name("Date")
    .description("returns a date from given parameters")
    .examples(["Date(2022, 2, 22)", "Date(2, 2, 2)"])
    .return({ type: "date", description: "date object" })
    .parameters([
    { name: "year", type: "number", description: "year as a number" },
    { name: "month", type: "number", description: "month as a number" },
    { name: "day", type: "number", description: "day as a number" },
])
    .interpret({
    postgres: (year, month, day) => `MAKE_DATE(${year}, ${month}, ${day})`,
    javascript: (year, month, day) => new Date(year, month - 1, day),
}));

var dayjs_min = {exports: {}};

(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return "["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return r?l(1,0):l(31,11);case f:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,l=this;r=Number(r);var $=O.p(h),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===f)return this.set(f,this.$M+r);if($===c)return this.set(c,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||$[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,v=this-M,g=O.m(this,M);return g=($={},$[c]=g/12,$[f]=g,$[h]=g/3,$[o]=(v-m)/6048e5,$[a]=(v-m)/864e5,$[u]=v/n,$[s]=v/e,$[i]=v/t,$)[y]||v,l?g:O.a(g)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w}));
} (dayjs_min));

var dayjs = dayjs_min.exports;

registry.define("function", (fn) => fn
    .name("DateFormat")
    .description("returns the date in the date format given in parameter")
    .examples([
    'DateFormat(Date(2, 2, 2), "YYYY/MM/DD")"',
    'DateFormat(Now(), "YYYY/MM/DD hh:mi:ss")',
])
    .return({ type: "string", description: "string formatted date" })
    .parameters([
    { name: "date", type: "date" },
    { name: "format", type: "string" },
])
    .interpret({
    postgres: (date, format) => `TO_CHAR(${date}::date, ${format})`,
    javascript: (date, format) => {
        format = format
            .replace(/mi/gi, "mm")
            .replace(/month/gi, "MMMM")
            .replace(/mon/gi, "MMM");
        return dayjs(date).format(format.replace("mi", "mm"));
    },
}));

registry.define("function", (fn) => fn
    .name("Day")
    .description("returns the day of the given date")
    .examples(["Day(Date(2022, 2, 22))"])
    .parameters([{ name: "date", type: "date" }])
    .return({ type: "number" })
    .interpret({
    postgres: (date) => `DATE_PART('day', ${date})`,
    javascript: (date) => date.getDay(),
}));

registry.define("function", (fn) => fn
    .name("Floor")
    .description("returns nearest number that equals or lower than the argument")
    .examples(["Floor(3.14)"])
    .parameters([{ name: "number", type: "number" }])
    .return({ type: "number" })
    .interpret({
    postgres: (num) => `floor(${num})`,
    javascript: (num) => Math.floor(num),
}));

registry.define("function", (fn) => fn
    .name("Hour")
    .description("returns the hour section of the given date")
    .examples(["Hour(Date(2022, 2, 22))"])
    .parameters([{ name: "date", type: "date" }])
    .return({ type: "number" })
    .interpret({
    postgres: (date) => `DATE_PART('hour', ${date})`,
    javascript: (date) => date.getHours(),
}));

registry.define("function", (fn) => fn
    .name("If")
    .description("returns the 2nd argument when the 1st argument is true, returns the 3rd argument otherwise.")
    .examples(['If(3 > 2, "TRUE", "FALSE")'])
    .parameters([
    { name: "boolean", type: "boolean" },
    { name: "any", type: "any" },
    { name: "any", type: "any" },
])
    .return({ type: "any" })
    .interpret({
    postgres: (exp, left, right) => `
        CASE
        WHEN ${exp} THEN ${left}
        ELSE ${right}
        END
      `,
    javascript: (exp, left, right) => exp ? left : right,
}));

registry.define("function", (fn) => fn
    .name("Lowercase")
    .description("returns a lowercase version of the given text")
    .examples(['Lowercase("HELLO")'])
    .parameters([{ name: "text", type: "string" }])
    .return({ type: "string" })
    .interpret({
    postgres: (text) => `LOWER(${text})`,
    javascript: (text) => text.toLowerCase(),
}));

registry.define("function", (fn) => fn
    .name("Minute")
    .description("returns the minute section of the given date")
    .examples(["Minute(Date(2022, 2, 22))"])
    .parameters([{ name: "date", type: "date" }])
    .return({ type: "number" })
    .interpret({
    postgres: (date) => `DATE_PART('minute', ${date})`,
    javascript: (date) => date.getMinutes(),
}));

registry.define("function", (fn) => fn
    .name("Month")
    .description("returns the month section of the given date")
    .examples(["Month(Date(2022, 2, 22))"])
    .parameters([{ name: "date", type: "date" }])
    .return({ type: "number" })
    .interpret({
    postgres: (date) => `DATE_PART('month', ${date})`,
    javascript: (date) => date.getMonth() + 1,
}));

registry.define("function", (fn) => fn
    .name("Now")
    .description("returns current timestamp")
    .examples(["Now()"])
    .parameters([])
    .return({ type: "date", description: "date object" })
    .interpret({
    postgres: () => `NOW()`,
    javascript: () => new Date(),
}));

registry.define("function", (fn) => fn
    .name("Random")
    .description("returns a random number")
    .examples(["Random()"])
    .parameters([])
    .return({ type: "number" })
    .interpret({
    postgres: () => `RANDOM()`,
    javascript: () => Math.random(),
}));

registry.define("function", (fn) => fn
    .name("Today")
    .description("returns current date")
    .examples(["Today()"])
    .parameters([])
    .return({ type: "date", description: "date object" })
    .interpret({
    postgres: () => `CURRENT_DATE`,
    javascript: () => new Date(),
}));

registry.define("function", (fn) => fn
    .name("Uppercase")
    .description("returns an uppercase version of the given text")
    .examples(['Uppercase("hello")'])
    .parameters([{ name: "text", type: "string" }])
    .return({ type: "string" })
    .interpret({
    postgres: (text) => `UPPER(${text})`,
    javascript: (text) => text.toUpperCase(),
}));

registry.define("function", (fn) => fn
    .name("Year")
    .description("returns the year section of the given date")
    .examples(["Year(Date(2022, 2, 22))"])
    .parameters([{ name: "date", type: "date" }])
    .return({ type: "number" })
    .interpret({
    postgres: (date) => `DATE_PART('year', ${date})`,
    javascript: (date) => date.getFullYear(),
}));

registry.define("function", (fn) => fn
    .name("String")
    .description("converts any type into a string")
    .examples(["String(NOW())"])
    .parameters([{ name: "type", type: "any" }])
    .return({ type: "string" })
    .interpret({
    postgres: (type) => JSON.stringify(type),
    javascript: (type) => type === null || type === undefined ? "" : JSON.stringify(type),
}));

registry.define("function", (fn) => fn
    .name("String")
    .description("converts a number into a string")
    .examples(["String(42)"])
    .parameters([{ name: "number", type: "number" }])
    .return({ type: "string" })
    .interpret({
    postgres: (text) => `CAST(${text} as TEXT)`,
    javascript: (number) => number.toString(),
}));

registry.define("function", (fn) => fn
    .name("String")
    .description("converts a boolean into a string")
    .examples(["String(true)"])
    .parameters([{ name: "boolean", type: "boolean" }])
    .return({ type: "string" })
    .interpret({
    postgres: (text) => `CAST(${text} as TEXT)`,
    javascript: (boolean) => boolean.toString(),
}));

registry.define("function", (fn) => fn
    .name("String")
    .description("converts a date into a string")
    .examples(["String(NOW())"])
    .parameters([{ name: "date", type: "date" }])
    .return({ type: "string" })
    .interpret({
    postgres: (text) => `CAST(${text} as TEXT)`,
    javascript: (date) => date.toString(),
}));

registry.define("function", (fn) => fn
    .name("Concatenate")
    .description("joins given arguments into one string")
    .examples(['Concatenate("Hello", UPPER("World"))'])
    .parameters([
    { name: "part1", type: "string" },
    { name: "part2", type: "string" },
])
    .return({ type: "string" })
    .interpret({
    postgres: (...parts) => `(${parts.join(" || ")})`,
    javascript: (...parts) => parts.join(""),
}));

registry.define("function", (fn) => fn
    .name("IsBlank")
    .description("check if a value is blank")
    .examples(['IsBlank("")'])
    .parameters([{ name: "text", type: "string" }])
    .return({ type: "boolean" })
    .interpret({
    postgres: (text) => `${text} = ''`,
    javascript: (text) => text === "",
}));

registry.define("function", (fn) => fn
    .name("WeekdayName")
    .description("get the day-of-week of a date as text")
    .examples(["WeekdayName(Date(2019, 2, 5))"])
    .parameters([{ name: "date", type: "date" }])
    .return({ type: "string" })
    .interpret({
    postgres: (date) => `WITH day AS (SELECT EXTRACT(isodow FROM date ${date}) AS idx),
      dayname AS(SELECT CASE 
               WHEN day.idx = 0 THEN 'Sunday'
               WHEN day.idx = 1 THEN 'Monday'
               WHEN day.idx = 2 THEN 'Tuesday'
               WHEN day.idx = 3 THEN 'Wednesday'
               WHEN day.idx = 4 THEN 'Thursday'
               WHEN day.idx = 5 THEN 'Friday'
               WHEN day.idx = 6 THEN 'Saturday'
           ELSE 'other'
         END FROM day ) 
       SELECT * FROM dayname;`,
    javascript: (date) => {
        const dateParsed = new Date(date);
        return [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ][dateParsed.getDay()];
    },
}));

registry.define("function", (fn) => fn
    .name("Trim")
    .description("trim starting and ending spaces from text")
    .examples(['Trim("Stay positive   ")', 'Trim("    loooking good!   "'])
    .parameters([{ name: "text", type: "string" }])
    .return({ type: "string" })
    .interpret({
    postgres: (text) => `TRIM(both ' ' FROM ${text})`,
    javascript: (text) => text.trim(),
}));

registry.define("function", (fn) => fn
    .name("EndsWith")
    .description("check if text ends with a suffix")
    .examples(['EndsWith("Hello world", "world")'])
    .parameters([
    { name: "text", type: "string" },
    { name: "suffix", type: "string" },
    { name: "ignoreCase", type: "boolean" },
    // { name: "ignoreAccents", type: "boolean"}
])
    .return({ type: "boolean" })
    .interpret({
    postgres: (text, suffix, ignoreCase = false, ignoreAccents = false) => `
        CASE
          WHEN ${ignoreCase} IS TRUE THEN LOWER(${text})
          ELSE ${text}
        END AS updatedtext
        CASE
          WHEN ${ignoreCase} IS TRUE THEN LOWER(${suffix})
          ELSE ${suffix}
        END AS updatedsuffix
        updatedtext LIKE '%' || updatedsuffix
      `,
    javascript: (text, suffix, ignoreCase = false, ignoreAccents = false) => {
        /* Implement later */
        // if (ignoreAccents){
        //   text = text.normalize("NFD").replace(/\p{Diacritic}/gu, "");
        // }
        if (ignoreCase) {
            text = text.toLowerCase();
            suffix = text.toLowerCase();
        }
        return text.endsWith(suffix);
    },
}));

registry.define("function", (fn) => fn
    .name("StartsWith")
    .description("Check if text starts with specified characters")
    .examples(['StartsWith("Hello, World!", "Hello", false)'])
    .parameters([
    { name: "text", type: "string", description: "the text to check" },
    {
        name: "searchText",
        type: "string",
        description: "the prefix to check for",
    },
    {
        name: "ignoreCase",
        type: "boolean",
        description: "whether to ignore case when checking",
    },
])
    .return({ type: "boolean" })
    .interpret({
    postgres: (text, searchText, ignoreCase) => {
        return `
        CASE WHEN ${ignoreCase} THEN LOWER(${text}) LIKE LOWER(${searchText}) || '%'
        ELSE ${text} LIKE ${searchText} || '%'
        END
      `;
    },
    javascript: function (text, searchText, ignoreCase) {
        if (ignoreCase) {
            text = text.toLowerCase();
            searchText = searchText.toLowerCase();
        }
        return text.startsWith(searchText);
    },
}));

registry.define("function", (fn) => fn
    .name("ContainsText")
    .description("Check if one text contains another.")
    .examples(['ContainsText("Hello World!", "ello", false)'])
    .parameters([
    { name: "text", type: "string" },
    { name: "searchText", type: "string" },
    { name: "ignoreCase", type: "boolean" },
])
    .return({ type: "boolean" })
    .interpret({
    postgres: (text, searchText, ignoreCase) => {
        return `
        CASE WHEN ${ignoreCase} THEN LOWER(${text}) LIKE '%' || LOWER(${searchText}) || '%'
        ELSE ${text} LIKE '%' || ${searchText} || '%'
        END
      `;
    },
    javascript: function (text, searchText, ignoreCase) {
        if (ignoreCase) {
            text = text.toLowerCase();
            searchText = searchText.toLowerCase();
        }
        return text.includes(searchText);
    },
}));

registry.define("function", (fn) => fn
    .name("ToMinutes")
    .description("convert a time duration into a number of minutes")
    .examples(["ToMinutes(60000)", "ToMinutes(Duration(0,1,0,0))"])
    .return({ type: "number" })
    .parameters([
    { name: "duration", type: "number", description: "miliseconds of time" },
])
    .interpret({
    postgres: (duration) => `round(${duration}::NUMERIC / 60000, 2)`,
    javascript: (duration) => {
        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(duration / 60000);
    },
}));

registry.define("function", (fn) => fn
    .name("ToSeconds")
    .description("convert a time duration into a number of seconds")
    .examples(["ToSeconds(1000)", "ToSeconds(Duration(0,0,1,0))"])
    .return({ type: "number" })
    .parameters([
    { name: "duration", type: "number", description: "miliseconds of time" },
])
    .interpret({
    postgres: (duration) => `round(${duration}::NUMERIC / 1000, 2)`,
    javascript: (duration) => {
        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(duration / 1000);
    },
}));

registry.define("function", (fn) => fn
    .name("Duration")
    .description("create a time duration")
    .examples(["Duration(4, 3, 2, 1)"])
    .return({ type: "number" })
    .parameters([
    { name: "days", type: "number", description: "the number of days" },
    { name: "hours", type: "number", description: "the number of hours" },
    { name: "minutes", type: "number", description: "the number of minutes" },
    { name: "seconds", type: "number", description: "the number of seconds" },
])
    .interpret({
    postgres: (days, hours, minutes, seconds) => `INTERVAL CAST(${days} AS text) || ' days ' || CAST(${hours} AS text) || ' hours ' || CAST(${minutes} AS text) || ' minutes ' || CAST(${seconds} AS text) || ' seconds'`,
    javascript: (days, hours, minutes, seconds) => {
        if (seconds > 60) {
            minutes += seconds / 60;
            seconds %= 60;
        }
        if (minutes > 60) {
            hours += minutes / 60;
            minutes %= 60;
        }
        if (hours > 24) {
            days += hours / 24;
            hours %= 24;
        }
        return ((days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds) * 1000);
    },
}));

registry.define("function", (fn) => fn
    .name("Difference")
    .description("create a time difference in milliseconds based on two date")
    .examples([
    "Duration(Date(2022,6,23), Date(2022,6,21))",
    "Duration(Today(), Date(2022,6,21))",
])
    .parameters([
    { name: "dateEnd", type: "date", description: "end date" },
    { name: "dateStart", type: "date", description: "start date" },
])
    .return({ type: "date" })
    .interpret({
    postgres: (dateEnd, dateStart) => `AGE(${dateEnd}, ${dateStart})`,
    javascript: (dateEnd, dateStart) => {
        return dateEnd.getTime() - dateStart.getTime();
    },
}));

registry.define("function", (fn) => fn
    .name("ToHours")
    .description("convert a time duration into a number of hours")
    .examples(["ToHours(3600000)", "ToHours(Duration(0,1,1,1))"])
    .return({ type: "number" })
    .parameters([
    { name: "duration", type: "number", description: "miliseconds of time" },
])
    .interpret({
    postgres: (duration) => `round(${duration}::NUMERIC / 3600000, 2)`,
    javascript: (duration) => {
        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(duration / 3600000);
    },
}));

registry.define("function", (fn) => fn
    .name("ToDays")
    .description("convert a time duration into a number of days")
    .examples(["ToDays(86400000)", "ToDays(Duration(0,1,1,1))"])
    .return({ type: "number" })
    .parameters([
    { name: "duration", type: "number", description: "miliseconds of time" },
])
    .interpret({
    postgres: (duration) => `round(${duration}::NUMERIC / 86400000, 2)`,
    javascript: (duration) => {
        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(duration / 86400000);
    },
}));

registry.define("function", (fn) => fn
    .name("IsNotBlank")
    .description("check if a value is not blank")
    .examples(['IsNotBlank("Hello!")'])
    .parameters([{ name: "text", type: "string" }])
    .return({ type: "boolean" })
    .interpret({
    postgres: (text) => `${text} <> ''`,
    javascript: (text) => text !== "",
}));

registry.define("function", (fn) => fn
    .name("Replace")
    .description("replace a range within text")
    .examples(['Replace("Spreadsheets", 1, 6, "Bed")'])
    .parameters([
    { name: "text", type: "string", description: "source text" },
    {
        name: "start",
        type: "number",
        description: "the character position to start from. Starts at 1",
    },
    {
        name: "numberOfCharacters",
        type: "number",
        description: "the number of characters to remove",
    },
    {
        name: "replacementText",
        type: "string",
        description: "text to substitute",
    },
])
    .return({ type: "string" })
    .interpret({
    postgres: (text, start, numberOfCharacters, replacementText) => `CONCAT(substring(${text},1,${start}-1), ${replacementText},substring(${text}, ${start} + ${numberOfCharacters}))`,
    javascript: (text, start, numberOfCharacters, replacementText) => text.substring(0, start - 1) +
        replacementText +
        text.substring(start + numberOfCharacters - 1),
}));

registry.define("function", (fn) => fn
    .name("Length")
    .description("returns length of the given text")
    .examples(['Length("Hello World!")'])
    .parameters([{ name: "text", type: "string" }])
    .return({ type: "number" })
    .interpret({
    postgres: (text) => `length(${text})`,
    javascript: (text) => text.length,
}));

var utc$1 = {exports: {}};

(function (module, exports) {
	!function(t,i){module.exports=i();}(commonjsGlobal,(function(){var t="minute",i=/[+-]\d\d(?::?\d\d)?/g,e=/([+-]|\d\d)/g;return function(s,f,n){var u=f.prototype;n.utc=function(t){var i={date:t,utc:!0,args:arguments};return new f(i)},u.utc=function(i){var e=n(this.toDate(),{locale:this.$L,utc:!0});return i?e.add(this.utcOffset(),t):e},u.local=function(){return n(this.toDate(),{locale:this.$L,utc:!1})};var o=u.parse;u.parse=function(t){t.utc&&(this.$u=!0),this.$utils().u(t.$offset)||(this.$offset=t.$offset),o.call(this,t);};var r=u.init;u.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds();}else r.call(this);};var a=u.utcOffset;u.utcOffset=function(s,f){var n=this.$utils().u;if(n(s))return this.$u?0:n(this.$offset)?a.call(this):this.$offset;if("string"==typeof s&&(s=function(t){void 0===t&&(t="");var s=t.match(i);if(!s)return null;var f=(""+s[0]).match(e)||["-",0,0],n=f[0],u=60*+f[1]+ +f[2];return 0===u?0:"+"===n?u:-u}(s),null===s))return this;var u=Math.abs(s)<=16?60*s:s,o=this;if(f)return o.$offset=u,o.$u=0===s,o;if(0!==s){var r=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(o=this.local().add(u+r,t)).$offset=u,o.$x.$localOffset=r;}else o=this.utc();return o};var h=u.format;u.format=function(t){var i=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return h.call(this,i)},u.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*t},u.isUTC=function(){return !!this.$u},u.toISOString=function(){return this.toDate().toISOString()},u.toString=function(){return this.toDate().toUTCString()};var l=u.toDate;u.toDate=function(t){return "s"===t&&this.$offset?n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():l.call(this)};var c=u.diff;u.diff=function(t,i,e){if(t&&this.$u===t.$u)return c.call(this,t,i,e);var s=this.local(),f=n(t).local();return c.call(s,f,i,e)};}}));
} (utc$1));

var utc = utc$1.exports;

dayjs.extend(utc);
registry.define("function", (fn) => fn
    .name("DateFormatUTC")
    .description("returns the date in the date format given in parameter")
    .examples([
    'DateFormatUTC(Date(2, 2, 2), "YYYY/MM/DD", 7)"',
    'DateFormatUTC(Now(), "YYYY/MM/DD hh:mi:ss", 7)',
])
    .return({ type: "string", description: "string formatted date" })
    .parameters([
    { name: "date", type: "date" },
    { name: "format", type: "string" },
    { name: "offset", type: "number" },
])
    .interpret({
    postgres: (date, format, offset) => `TO_CHAR(${date}::timestamp at time zone '${offset}', ${format})`,
    javascript: (date, format, offset) => {
        format = format
            .replace(/mi/gi, "mm")
            .replace(/month/gi, "MMMM")
            .replace(/mon/gi, "MMM");
        return dayjs(date)
            .utc()
            .utcOffset(offset * 60)
            .format(format.replace("mi", "mm"));
    },
}));

const javascriptConfig = {
    functions: Array.from(registry.configs.function.values()).map((config) => (Object.assign(Object.assign({}, config), { evaluate: (...args) => {
            return config.interpret.javascript(...args);
        } }))),
    operators: Array.from(registry.configs.operator.values()).map((config) => (Object.assign(Object.assign({}, config), { evaluate: (...args) => {
            return config.interpret.javascript(...args);
        } }))),
    variables: Array.from(registry.configs.variable.values()).map((config) => (Object.assign(Object.assign({}, config), { evaluate: () => {
            return config.interpret.javascript();
        } }))),
};

const postgresConfig = {
    functions: Array.from(registry.configs.function.values()).map((config) => (Object.assign(Object.assign({}, config), { generate: (...args) => {
            return config.interpret.postgres(...args);
        } }))),
    operators: Array.from(registry.configs.operator.values()).map((config) => (Object.assign(Object.assign({}, config), { generate: (...args) => {
            return config.interpret.postgres(...args);
        } }))),
    variables: Array.from(registry.configs.variable.values()).map((config) => (Object.assign(Object.assign({}, config), { generate: () => {
            return config.interpret.postgres();
        } }))),
};

const mergeConfig = (configA, configB) => ({
    functions: configA.functions.concat(configB.functions || []),
    operators: configA.operators.concat(configB.operators || []),
    variables: configA.variables.concat(configB.variables || []),
    type: configA.type || configB.type,
});

const evaluate$1 = (ast, target, options) => target === "javascript"
    ? lib.evaluate(ast, mergeConfig(javascriptConfig, options))
    : lib.generate(ast, mergeConfig(postgresConfig, options));

var functionGeneratorConfigs = [
    {
        name: "Max",
        description: "Maximum number of column value",
        parameters: [{ name: "column", description: "Column", type: "number" }],
        "return": {
            type: "number"
        },
        examples: [],
        generate: function (column) { return "Max(".concat(column, ")"); }
    },
    {
        name: "Count",
        description: "Count number of rows",
        parameters: [{ name: "column", description: "Column", type: "number" }],
        "return": {
            type: "number"
        },
        examples: [],
        generate: function (column) { return "Count(".concat(column, ")"); }
    },
    {
        name: "Point",
        description: "Returns a point from given parameters",
        examples: ["Point(102.1234, 68.1239)"],
        "return": { type: "Point", description: "Point object" },
        parameters: [
            {
                name: "longitude",
                type: "number",
                description: "longitude point number"
            },
            {
                name: "latitude",
                type: "number",
                description: "latitude point number"
            },
        ],
        generate: function (longitude, latitude) {
            return "'SRID=4326;POINT(".concat(longitude, " ").concat(latitude, ")'");
        }
    },
    {
        name: "Distance",
        description: "Calculate distance between 2 points in meters",
        examples: [
            "Distance(home,school)",
            "Distance(Point(3.1234,6.12343),Point(1.2345,5.124))",
        ],
        "return": { type: "number" },
        parameters: [
            { name: "point_1", type: "Point", description: "Point 1" },
            { name: "point_2", type: "Point", description: "Point 2" },
        ],
        generate: function (point_1, point_2) {
            return "ST_Distance(".concat(point_1, "::geography,").concat(point_2, "::geography)");
        }
    },
    {
        name: "Within",
        description: "Returns whether a point is in a polygon or not",
        examples: ["Within(point,area)"],
        "return": { type: "boolean" },
        parameters: [
            { name: "point", type: "Point", description: "Point" },
            { name: "area", type: "Polygon", description: "Polygon" },
        ],
        generate: function (point, area) {
            return "ST_WITHIN(".concat(point, "::geometry,").concat(area, "::geometry)");
        }
    },
];
var functionEvaluatorConfigs = [
    {
        name: "FormatDate",
        description: "format date with given formatting tokens",
        parameters: [
            {
                name: "format",
                type: "string",
                description: "string of formatting tokens"
            },
            { name: "date", type: "date", description: "date to format" },
        ],
        "return": {
            type: "string",
            description: "string formatted date"
        },
        evaluate: function (format, date) {
            return dayjs(new Date(date)).format(format);
        }
    },
];
var evaluate = function (formula, target, variables) {
    if (variables === void 0) { variables = []; }
    var config = mergeConfig(postgresConfig, { variables: variables });
    var parse = lib.buildExpressionParser(config);
    var _a = parse(formula), ast = _a.ast, errors = _a.errors;
    if (errors.length > 0) {
        throw Error(errors[0].message);
    }
    return evaluate$1(ast, target, {
        functions: target === "postgres"
            ? functionGeneratorConfigs
            : functionEvaluatorConfigs,
        variables: variables.map(function (variable) { return ({
            name: variable.name,
            type: variable.type,
            generate: function () { return variable.value; },
            evaluate: function () { return eval(variable.value); }
        }); })
    });
};
var evaluateAST = function (ast, target, variables) {
    if (variables === void 0) { variables = []; }
    return evaluate$1(ast, target, {
        functions: target === "postgres"
            ? functionGeneratorConfigs
            : functionEvaluatorConfigs,
        variables: variables.map(function (variable) { return ({
            name: variable.name,
            type: variable.type,
            generate: function () { return variable.value; },
            evaluate: function () { return eval(variable.value); }
        }); })
    });
};

exports.evaluate = evaluate;
exports.evaluateAST = evaluateAST;
