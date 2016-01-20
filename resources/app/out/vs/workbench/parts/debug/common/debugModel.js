/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/nls', 'vs/base/common/lifecycle', 'vs/base/common/eventEmitter', 'vs/base/common/uuid', 'vs/base/common/types', 'vs/base/common/arrays', 'vs/workbench/parts/debug/common/debug', 'vs/workbench/parts/debug/common/debugSource'], function (require, exports, winjs_base_1, nls, lifecycle, ee, uuid, types, arrays, debug, debugSource_1) {
    function resolveChildren(debugService, parent) {
        var session = debugService.getActiveSession();
        // only variables with reference > 0 have children.
        if (!session || parent.reference <= 0) {
            return winjs_base_1.TPromise.as([]);
        }
        return session.variables({ variablesReference: parent.reference }).then(function (response) {
            return arrays.distinct(response.body.variables, function (v) { return v.name; }).map(function (v) { return new Variable(parent, v.variablesReference, v.name, v.value); });
        }, function (e) { return [new Variable(parent, 0, null, e.message, false)]; });
    }
    function massageValue(value) {
        return value ? value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') : value;
    }
    var notPropertySyntax = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    var arrayElementSyntax = /\[.*\]$/;
    function getFullExpressionName(expression, sessionType) {
        var names = [expression.name];
        if (expression instanceof Variable) {
            var v = expression.parent;
            while (v instanceof Variable || v instanceof Expression) {
                names.push(v.name);
                v = v.parent;
            }
        }
        names = names.reverse();
        var result = null;
        names.forEach(function (name) {
            if (!result) {
                result = name;
            }
            else if (arrayElementSyntax.test(name) || (sessionType === 'node' && !notPropertySyntax.test(name))) {
                // use safe way to access node properties a['property_name']. Also handles array elements.
                result = name && name.indexOf('[') === 0 ? "" + result + name : result + "['" + name + "']";
            }
            else {
                result = result + "." + name;
            }
        });
        return result;
    }
    exports.getFullExpressionName = getFullExpressionName;
    var Thread = (function () {
        function Thread(name, threadId, callStack) {
            this.name = name;
            this.threadId = threadId;
            this.callStack = callStack;
            this.stoppedReason = undefined;
        }
        Thread.prototype.getId = function () {
            return "thread:" + this.name + ":" + this.threadId;
        };
        return Thread;
    })();
    exports.Thread = Thread;
    var OutputElement = (function () {
        function OutputElement(grouped) {
            if (grouped === void 0) { grouped = false; }
            this.grouped = grouped;
            this.id = uuid.generateUuid();
        }
        OutputElement.prototype.getId = function () {
            return this.id;
        };
        return OutputElement;
    })();
    exports.OutputElement = OutputElement;
    var ValueOutputElement = (function (_super) {
        __extends(ValueOutputElement, _super);
        function ValueOutputElement(value, severity, grouped, category, counter) {
            if (grouped === void 0) { grouped = false; }
            if (counter === void 0) { counter = 1; }
            _super.call(this, grouped);
            this.value = value;
            this.severity = severity;
            this.category = category;
            this.counter = counter;
        }
        return ValueOutputElement;
    })(OutputElement);
    exports.ValueOutputElement = ValueOutputElement;
    var KeyValueOutputElement = (function (_super) {
        __extends(KeyValueOutputElement, _super);
        function KeyValueOutputElement(key, valueObj, annotation, grouped) {
            _super.call(this, grouped);
            this.key = key;
            this.valueObj = valueObj;
            this.annotation = annotation;
            this._valueName = null;
        }
        Object.defineProperty(KeyValueOutputElement.prototype, "value", {
            get: function () {
                if (this._valueName === null) {
                    if (this.valueObj === null) {
                        this._valueName = 'null';
                    }
                    else if (Array.isArray(this.valueObj)) {
                        this._valueName = "Array[" + this.valueObj.length + "]";
                    }
                    else if (types.isObject(this.valueObj)) {
                        this._valueName = 'Object';
                    }
                    else if (types.isString(this.valueObj)) {
                        this._valueName = "\"" + massageValue(this.valueObj) + "\"";
                    }
                    else {
                        this._valueName = String(this.valueObj);
                    }
                    if (!this._valueName) {
                        this._valueName = '';
                    }
                }
                return this._valueName;
            },
            enumerable: true,
            configurable: true
        });
        KeyValueOutputElement.prototype.getChildren = function () {
            var _this = this;
            if (!this.children) {
                if (Array.isArray(this.valueObj)) {
                    this.children = this.valueObj.slice(0, KeyValueOutputElement.MAX_CHILDREN).map(function (v, index) { return new KeyValueOutputElement(String(index), v, null, true); });
                }
                else if (types.isObject(this.valueObj)) {
                    this.children = Object.getOwnPropertyNames(this.valueObj).slice(0, KeyValueOutputElement.MAX_CHILDREN).map(function (key) { return new KeyValueOutputElement(key, _this.valueObj[key], null, true); });
                }
                else {
                    this.children = [];
                }
            }
            return this.children;
        };
        KeyValueOutputElement.MAX_CHILDREN = 1000; // upper bound of children per value
        return KeyValueOutputElement;
    })(OutputElement);
    exports.KeyValueOutputElement = KeyValueOutputElement;
    var Expression = (function () {
        function Expression(name, cacheChildren, id) {
            if (id === void 0) { id = uuid.generateUuid(); }
            this.name = name;
            this.cacheChildren = cacheChildren;
            this.id = id;
            this.reference = 0;
            this.value = Expression.DEFAULT_VALUE;
            this.available = false;
            this.children = null;
        }
        Object.defineProperty(Expression.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = massageValue(value);
            },
            enumerable: true,
            configurable: true
        });
        Expression.prototype.getId = function () {
            return this.id;
        };
        Expression.prototype.getChildren = function (debugService) {
            if (!this.cacheChildren) {
                return resolveChildren(debugService, this);
            }
            if (!this.children) {
                this.children = resolveChildren(debugService, this);
            }
            return this.children;
        };
        Expression.DEFAULT_VALUE = 'not available';
        return Expression;
    })();
    exports.Expression = Expression;
    var Variable = (function () {
        function Variable(parent, reference, name, value, available) {
            if (available === void 0) { available = true; }
            this.parent = parent;
            this.reference = reference;
            this.name = name;
            this.available = available;
            this.children = null;
            this.value = massageValue(value);
            this.valueChanged = Variable.allValues[this.getId()] && Variable.allValues[this.getId()] !== value;
            Variable.allValues[this.getId()] = value;
        }
        Variable.prototype.getId = function () {
            return "variable:" + this.parent.getId() + ":" + this.name;
        };
        Variable.prototype.getChildren = function (debugService) {
            if (!this.children) {
                this.children = resolveChildren(debugService, this);
            }
            return this.children;
        };
        Variable.allValues = {};
        return Variable;
    })();
    exports.Variable = Variable;
    var Scope = (function () {
        function Scope(threadId, name, reference, expensive) {
            this.threadId = threadId;
            this.name = name;
            this.reference = reference;
            this.expensive = expensive;
            this.children = null;
        }
        Scope.prototype.getId = function () {
            return "scope:" + this.threadId + ":" + this.name + ":" + this.reference;
        };
        Scope.prototype.getChildren = function (debugService) {
            if (!this.children) {
                this.children = resolveChildren(debugService, this);
            }
            return this.children;
        };
        return Scope;
    })();
    exports.Scope = Scope;
    var StackFrame = (function () {
        function StackFrame(threadId, frameId, source, name, lineNumber, column) {
            this.threadId = threadId;
            this.frameId = frameId;
            this.source = source;
            this.name = name;
            this.lineNumber = lineNumber;
            this.column = column;
            this.internalId = uuid.generateUuid();
            this.scopes = null;
        }
        StackFrame.prototype.getId = function () {
            return this.internalId;
        };
        StackFrame.prototype.getScopes = function (debugService) {
            var _this = this;
            if (!this.scopes) {
                this.scopes = debugService.getActiveSession().scopes({ frameId: this.frameId }).then(function (response) {
                    return response.body.scopes.map(function (rs) { return new Scope(_this.threadId, rs.name, rs.variablesReference, rs.expensive); });
                }, function (err) { return []; });
            }
            return this.scopes;
        };
        return StackFrame;
    })();
    exports.StackFrame = StackFrame;
    var Breakpoint = (function () {
        function Breakpoint(source, desiredLineNumber, enabled, condition) {
            this.source = source;
            this.desiredLineNumber = desiredLineNumber;
            this.enabled = enabled;
            this.condition = condition;
            if (enabled === undefined) {
                this.enabled = true;
            }
            this.lineNumber = this.desiredLineNumber;
            this.verified = false;
            this.id = uuid.generateUuid();
        }
        Breakpoint.prototype.getId = function () {
            return this.id;
        };
        return Breakpoint;
    })();
    exports.Breakpoint = Breakpoint;
    var FunctionBreakpoint = (function () {
        function FunctionBreakpoint(name, enabled) {
            this.name = name;
            this.enabled = enabled;
            this.error = false;
            this.id = uuid.generateUuid();
        }
        FunctionBreakpoint.prototype.getId = function () {
            return this.id;
        };
        return FunctionBreakpoint;
    })();
    exports.FunctionBreakpoint = FunctionBreakpoint;
    var ExceptionBreakpoint = (function () {
        function ExceptionBreakpoint(name, enabled) {
            this.name = name;
            this.enabled = enabled;
            this.id = uuid.generateUuid();
        }
        ExceptionBreakpoint.prototype.getId = function () {
            return this.id;
        };
        return ExceptionBreakpoint;
    })();
    exports.ExceptionBreakpoint = ExceptionBreakpoint;
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(breakpoints, breakpointsActivated, functionBreakpoints, exceptionBreakpoints, watchExpressions) {
            _super.call(this);
            this.breakpoints = breakpoints;
            this.breakpointsActivated = breakpointsActivated;
            this.functionBreakpoints = functionBreakpoints;
            this.exceptionBreakpoints = exceptionBreakpoints;
            this.watchExpressions = watchExpressions;
            this.threads = {};
            this.replElements = [];
            this.toDispose = [];
        }
        Model.prototype.getId = function () {
            return 'root';
        };
        Model.prototype.getThreads = function () {
            return this.threads;
        };
        Model.prototype.clearThreads = function (removeThreads, reference) {
            if (reference === void 0) { reference = undefined; }
            if (reference) {
                if (removeThreads) {
                    delete this.threads[reference];
                }
                else {
                    this.threads[reference].callStack = [];
                    this.threads[reference].stoppedReason = undefined;
                }
            }
            else {
                if (removeThreads) {
                    this.threads = {};
                    Variable.allValues = {};
                }
                else {
                    for (var ref in this.threads) {
                        if (this.threads.hasOwnProperty(ref)) {
                            this.threads[ref].callStack = [];
                            this.threads[ref].stoppedReason = undefined;
                        }
                    }
                }
            }
            this.emit(debug.ModelEvents.CALLSTACK_UPDATED);
        };
        Model.prototype.getBreakpoints = function () {
            return this.breakpoints;
        };
        Model.prototype.getFunctionBreakpoints = function () {
            return this.functionBreakpoints;
        };
        Model.prototype.getExceptionBreakpoints = function () {
            return this.exceptionBreakpoints;
        };
        Model.prototype.areBreakpointsActivated = function () {
            return this.breakpointsActivated;
        };
        Model.prototype.toggleBreakpointsActivated = function () {
            this.breakpointsActivated = !this.breakpointsActivated;
            this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
        };
        Model.prototype.addBreakpoints = function (rawData) {
            var _this = this;
            this.breakpoints = this.breakpoints.concat(rawData.map(function (rawBp) { return new Breakpoint(new debugSource_1.Source(debugSource_1.Source.toRawSource(rawBp.uri, _this)), rawBp.lineNumber, rawBp.enabled, rawBp.condition); }));
            this.breakpointsActivated = true;
            this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
        };
        Model.prototype.removeBreakpoints = function (toRemove) {
            this.breakpoints = this.breakpoints.filter(function (bp) { return !toRemove.some(function (toRemove) { return toRemove.getId() === bp.getId(); }); });
            this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
        };
        Model.prototype.updateBreakpoints = function (data) {
            this.breakpoints.forEach(function (bp) {
                var bpData = data[bp.getId()];
                if (bpData) {
                    bp.lineNumber = bpData.line;
                    bp.verified = bpData.verified;
                }
            });
            this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
        };
        Model.prototype.toggleEnablement = function (element) {
            element.enabled = !element.enabled;
            if (element instanceof Breakpoint && !element.enabled) {
                var breakpoint = element;
                breakpoint.lineNumber = breakpoint.desiredLineNumber;
                breakpoint.verified = false;
            }
            this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
        };
        Model.prototype.enableOrDisableAllBreakpoints = function (enabled) {
            this.breakpoints.forEach(function (bp) {
                bp.enabled = enabled;
                if (!enabled) {
                    bp.lineNumber = bp.desiredLineNumber;
                    bp.verified = false;
                }
            });
            this.exceptionBreakpoints.forEach(function (ebp) { return ebp.enabled = enabled; });
            this.functionBreakpoints.forEach(function (fbp) { return fbp.enabled = enabled; });
            this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
        };
        Model.prototype.addFunctionBreakpoint = function (functionName) {
            this.functionBreakpoints.push(new FunctionBreakpoint(functionName, true));
            this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
        };
        Model.prototype.renameFunctionBreakpoint = function (id, newFunctionName) {
            var fbp = this.functionBreakpoints.filter(function (bp) { return bp.getId() === id; }).pop();
            if (fbp) {
                fbp.name = newFunctionName;
                this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
            }
        };
        Model.prototype.removeFunctionBreakpoints = function (id) {
            this.functionBreakpoints = id ? this.functionBreakpoints.filter(function (fbp) { return fbp.getId() != id; }) : [];
            this.emit(debug.ModelEvents.BREAKPOINTS_UPDATED);
        };
        Model.prototype.getReplElements = function () {
            return this.replElements;
        };
        Model.prototype.addReplExpression = function (session, stackFrame, name) {
            var _this = this;
            var expression = new Expression(name, true);
            this.replElements.push(expression);
            return this.evaluateExpression(session, stackFrame, expression, true).then(function () {
                return _this.emit(debug.ModelEvents.REPL_ELEMENTS_UPDATED, expression);
            });
        };
        Model.prototype.logToRepl = function (value, severity) {
            var elements = [];
            var previousOutput = this.replElements.length && this.replElements[this.replElements.length - 1];
            var groupTogether = !!previousOutput && severity === previousOutput.severity;
            // string message
            if (typeof value === 'string') {
                if (value && value.trim() && previousOutput && previousOutput.value === value && previousOutput.severity === severity) {
                    previousOutput.counter++; // we got the same output (but not an empty string when trimmed) so we just increment the counter
                }
                else {
                    var lines = value.split('\n');
                    lines.forEach(function (line, index) {
                        elements.push(new ValueOutputElement(line, severity, groupTogether || index > 0));
                    });
                }
            }
            else {
                elements.push(new KeyValueOutputElement(value.prototype, value, nls.localize('snapshotObj', "Only primitive values are shown for this object."), groupTogether));
            }
            if (elements.length) {
                (_a = this.replElements).push.apply(_a, elements);
                this.emit(debug.ModelEvents.REPL_ELEMENTS_UPDATED, elements);
            }
            var _a;
        };
        Model.prototype.appendReplOutput = function (value, severity) {
            var elements = [];
            var previousOutput = this.replElements.length && this.replElements[this.replElements.length - 1];
            var lines = value.split('\n');
            var groupTogether = !!previousOutput && previousOutput.category === 'output' && severity === previousOutput.severity;
            if (groupTogether) {
                previousOutput.value += lines.shift(); // append to previous line if same group
            }
            // fill in lines as output value elements
            lines.forEach(function (line, index) {
                elements.push(new ValueOutputElement(line, severity, groupTogether || index > 0, 'output'));
            });
            (_a = this.replElements).push.apply(_a, elements);
            this.emit(debug.ModelEvents.REPL_ELEMENTS_UPDATED, elements);
            var _a;
        };
        Model.prototype.clearReplExpressions = function () {
            this.replElements = [];
            this.emit(debug.ModelEvents.REPL_ELEMENTS_UPDATED);
        };
        Model.prototype.getWatchExpressions = function () {
            return this.watchExpressions;
        };
        Model.prototype.addWatchExpression = function (session, stackFrame, name) {
            var we = new Expression(name, false);
            this.watchExpressions.push(we);
            if (!name) {
                this.emit(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED, we);
                return winjs_base_1.Promise.as(null);
            }
            return this.evaluateWatchExpressions(session, stackFrame, we.getId());
        };
        Model.prototype.renameWatchExpression = function (session, stackFrame, id, newName) {
            var _this = this;
            var filtered = this.watchExpressions.filter(function (we) { return we.getId() === id; });
            if (filtered.length === 1) {
                filtered[0].name = newName;
                return this.evaluateExpression(session, stackFrame, filtered[0], false).then(function () {
                    _this.emit(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED, filtered[0]);
                });
            }
            return winjs_base_1.Promise.as(null);
        };
        Model.prototype.evaluateWatchExpressions = function (session, stackFrame, id) {
            var _this = this;
            if (id === void 0) { id = null; }
            if (id) {
                var filtered = this.watchExpressions.filter(function (we) { return we.getId() === id; });
                if (filtered.length !== 1) {
                    return winjs_base_1.Promise.as(null);
                }
                return this.evaluateExpression(session, stackFrame, filtered[0], false).then(function () {
                    _this.emit(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED, filtered[0]);
                });
            }
            return winjs_base_1.Promise.join(this.watchExpressions.map(function (we) { return _this.evaluateExpression(session, stackFrame, we, false); })).then(function () {
                _this.emit(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED);
            });
        };
        Model.prototype.evaluateExpression = function (session, stackFrame, expression, fromRepl) {
            if (!session) {
                expression.value = fromRepl ? nls.localize('startDebugFirst', "Please start a debug session to evaluate") : Expression.DEFAULT_VALUE;
                expression.available = false;
                expression.reference = 0;
                return winjs_base_1.Promise.as(null);
            }
            return session.evaluate({
                expression: expression.name,
                frameId: stackFrame ? stackFrame.frameId : undefined,
                context: fromRepl ? 'repl' : 'watch'
            }).then(function (response) {
                expression.value = response.body.result;
                expression.available = true;
                expression.reference = response.body.variablesReference;
            }, function (err) {
                expression.value = err.message;
                expression.available = false;
                expression.reference = 0;
            });
        };
        Model.prototype.clearWatchExpressionValues = function () {
            this.watchExpressions.forEach(function (we) {
                we.value = Expression.DEFAULT_VALUE;
                we.available = false;
                we.reference = 0;
            });
            this.emit(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED);
        };
        Model.prototype.clearWatchExpressions = function (id) {
            if (id === void 0) { id = null; }
            this.watchExpressions = id ? this.watchExpressions.filter(function (we) { return we.getId() !== id; }) : [];
            this.emit(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED);
        };
        Model.prototype.sourceIsUnavailable = function (source) {
            var _this = this;
            Object.keys(this.threads).forEach(function (key) {
                _this.threads[key].callStack.forEach(function (stackFrame) {
                    if (stackFrame.source.uri.toString() === source.uri.toString()) {
                        stackFrame.source.available = false;
                    }
                });
            });
            this.emit(debug.ModelEvents.CALLSTACK_UPDATED);
        };
        Model.prototype.rawUpdate = function (data) {
            if (data.thread) {
                this.threads[data.threadId] = new Thread(data.thread.name, data.thread.id, []);
            }
            if (data.callStack) {
                // convert raw call stack into proper modelled call stack
                this.threads[data.threadId].callStack = data.callStack.map(function (rsf, level) {
                    if (!rsf) {
                        return new StackFrame(data.threadId, 0, new debugSource_1.Source({ name: 'unknown' }), nls.localize('unknownStack', "Unknown stack location"), undefined, undefined);
                    }
                    return new StackFrame(data.threadId, rsf.id, rsf.source ? new debugSource_1.Source(rsf.source) : new debugSource_1.Source({ name: 'unknown' }), rsf.name, rsf.line, rsf.column);
                });
                this.threads[data.threadId].stoppedReason = data.stoppedReason;
            }
            this.emit(debug.ModelEvents.CALLSTACK_UPDATED);
        };
        Model.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.threads = null;
            this.breakpoints = null;
            this.exceptionBreakpoints = null;
            this.functionBreakpoints = null;
            this.watchExpressions = null;
            this.replElements = null;
            this.toDispose = lifecycle.disposeAll(this.toDispose);
        };
        return Model;
    })(ee.EventEmitter);
    exports.Model = Model;
});
//# sourceMappingURL=debugModel.js.map