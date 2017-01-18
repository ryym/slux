"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var slux_1 = require("../slux");
var v = slux_1.some(function (m2) { return (__assign({ b: 1 }, m2)); }, function () { return ({ a: 1 }); });
var aaa = v.c;
var store = slux_1.createStore('test', {
    getInitialState: function () { return ({ value: 0 }); },
    takeSnapshot: function (s) { return s.value; },
});
store.onStateChange(function (m) {
    console.log('CHANGE', m, store.getState());
});
var increment = slux_1.mutation('Increment', function (s, add) {
    s.value += add;
    return s;
});
store.commit(increment, 2);
var mutation2 = slux_1.createMutation(function (s) { return s.value; }, function (s, v) {
    s.value = v;
    return s;
});
var increment2 = mutation2('Increment2', function (n) { return n + 1; });
store.commit(increment2);
var incrementAsync = slux_1.action('Increment-Async', function (_a, _, _b) {
    var commit = _a.commit;
    var add = _b.add, _c = _b.delay, delay = _c === void 0 ? 100 : _c;
    setTimeout(function () {
        commit(increment, add);
    }, delay);
});
store.run(incrementAsync, { add: 1 });
var _a = slux_1.createDispatcherWithCommands(store, function (to) { return ({
    increment: to(increment),
    inAsync: to(incrementAsync),
}); }), dispatcher = _a.dispatcher, commands = _a.commands;
dispatcher.dispatch(commands.increment, 2);
dispatcher.dispatch(commands.inAsync, { add: 2 });
var inc2Cmd = dispatcher.define(increment2);
dispatcher.dispatch(inc2Cmd);
