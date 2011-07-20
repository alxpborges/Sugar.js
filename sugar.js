function sugar (args, obj) {
    var linear = null;   //Define linear arguments
    
    var match = function (pat, args) {
        for (var i in pat) {
            if (typeof pat[i] == 'object') {
                if (args[i] === undefined || !match(pat[i], args[i])) {
                    return false;
                }
            } else if ((args[i] === undefined && pat[i].indexOf('-')) || typeof args[i] == 'object') {
                return false;
            }
        }
        return true;
    };
    
    var define = function (pat, args) {
        linear = [];
        for (var i in pat) {
            if (typeof pat[i] == 'object') {
                define(pat[i], args[i]);
            } else {
                linear[pat[i].slice(pat[i].indexOf('-')?0:1)] = args[i];
            }
        }
    };
    
    var maybe = function (pattern) {
        if (linear === null && match(pattern, args)) {
            define(pattern, args);
        }
        return maybe;
    };
    
    maybe.def = function (def) {
        for (var i in def) {
            if (linear[i] === undefined) {
                linear[i] = def[i];
            }
        }
        return maybe;
    };
    
    maybe.wrong = function (msg) {
        maybe.msg = msg;
        return maybe;
    };
    
    maybe.end = function (view, fn) {
        if (linear === null) {
            throw new Error(maybe.msg || 'Unexpected number of arguments');
        } else {
            view = view.split(',');
            var args = [];
            for (var i=0 ; i<view.length ; i++) {
                args.push(linear[view[i]]);
            }
            return fn.apply(obj, args);
        }
    };
    
    return maybe;    
}