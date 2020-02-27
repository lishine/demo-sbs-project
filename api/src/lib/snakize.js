export function snakize(obj) {
    if (typeof obj === 'string') {
        return snakeCase(obj)
    }
    return walk(obj)
}

function walk(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj
    }
    if (isDate(obj) || isRegex(obj)) {
        return obj
    }
    if (isArray(obj)) {
        return map(obj, walk)
    }
    return reduce(
        objectKeys(obj),
        function(acc, key) {
            var camel = snakeCase(key)
            acc[camel] = walk(obj[key])
            return acc
        },
        {}
    )
}

function snakeCase(str) {
    var upperChars = str.match(/([A-Z])/g)
    if (!upperChars) {
        return str
    }

    for (var i = 0, n = upperChars.length; i < n; i++) {
        str = str.replace(new RegExp(upperChars[i]), '_' + upperChars[i].toLowerCase())
    }

    if (str.slice(0, 1) === '_') {
        str = str.slice(1)
    }
    return str
}

var isArray =
    Array.isArray ||
    function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    }

var isDate = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]'
}

var isRegex = function(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]'
}

var has = Object.prototype.hasOwnProperty
var objectKeys =
    Object.keys ||
    function(obj) {
        var keys = []
        for (var key in obj) {
            if (has.call(obj, key)) {
                keys.push(key)
            }
        }
        return keys
    }

function map(xs, f) {
    if (xs.map) {
        return xs.map(f)
    }
    var res = []
    for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i))
    }
    return res
}

function reduce(xs, f, acc) {
    if (xs.reduce) {
        return xs.reduce(f, acc)
    }
    for (var i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i)
    }
    return acc
}
