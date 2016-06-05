var Views = require("./Views")

var forEach = require("mout/array/forEach")
var filter = require("mout/array/filter")
var findIndex = require("mout/array/findIndex")
var map = require("mout/array/map")
var difference = require("mout/array/difference")
var contains = require("mout/array/contains")

exports.update = function (rootView, orgView, newView) {
    
    var rootHandlers = rootView.rootHandlers

    var orgTypes = map(orgView.handlers, toType)
    var newTypes = map(newView.handlers, toType)
    var handlersToRemove = difference(orgTypes, newTypes)

    forEach(handlersToRemove, function (type) {
        var handlerIdx = findIndex(rootHandlers[type], byId(orgView))
        rootHandlers[type].splice(handlerIdx, 1) 
    })

    orgView.handlers = newView.handlers

    forEach(newView.handlers, function (h) {

        var typeHandlers = rootHandlers[h.type] || []

        if (!rootHandlers[h.type]) {
            rootHandlers[h.type] = typeHandlers
            rootView.el.addEventListener(h.type.slice(2),
                delegateEventHandler(rootHandlers[h.type]))
        }

        var existingIdx = findIndex(typeHandlers, byId(h))
        var newHandler = { id: h.id ,fn: h.fn }
        
        if (existingIdx >= 0) {
            typeHandlers.splice(existingIdx, 1, newHandler)
        }
        else {
            typeHandlers.push(newHandler)
        }
    })

    function byId (x) {
        return function (y) {
            return x.id === y.id
        }
    }

    function toType (x) {
        return x.type
    }
}

function delegateEventHandler (rootHandlers) {
    return function (event) {
        var targetId = event.target.getAttribute("data-lymphid")
        forEach(rootHandlers, function (h) {
            if (targetId === h.id) {
                h.fn.bind(event.target)(event)
            }
        })
    }
}

function removeIf (arr, fn) {
    var len = arr.length
    for (var i = len - 1; i >= 0; i--) {
        if (fn(arr[i])) {
            arr.splice(i, 1)
        }
    }
}

exports.suite = function (test) {

    test("adds a new handler", function (assert) {
        var rv = {
             el: document.body
            ,rootHandlers: {}
        }

        exports.update(rv, {}, {
            handlers: [
                {id:"R:0", type:"onclick", fn:handler}
            ]
        })

        assert(rv.rootHandlers.onclick, [
            {id:"R:0", fn:handler}
        ])

        function handler () {}
    })

    test("updates an existing handler", function (assert) {
        var rv = {
             el: document.body
            ,rootHandlers: {
                "onclick": [
                    {id:"R:0", fn:handlerA} 
                ]
            }
        }

        exports.update(rv, {}, {
            handlers: [
                {id:"R:0", type:"onclick", fn:handlerB}
            ]
        })

        assert(rv.rootHandlers.onclick[0].fn(), "B")

        function handlerA () { return "A" }
        function handlerB () { return "B" }
    })

    test("remove existing handler", function (assert) {

        var rv = {
             el: document.body
            ,rootHandlers: {
                 "onclick": [
                     {id:"R:0", fn:handlerA}
                ]
                ,"ondblclick": [
                     {id:"R:0", fn:handlerB}
                ]
            }
        }

        var ov = {
             id: "R:0"
            ,handlers: [
                 {id:"R:0", type: "ondblclick", fn:handlerA}
                ,{id:"R:0", type: "onclick",    fn:handlerB}
            ]
        }

        exports.update(rv, ov, {
             id: "R:0"
            ,handlers: [
                 {id:"R:0", type:"onclick", fn:handlerB}
            ]
        })

        assert(rv.rootHandlers.ondblclick.length, 0)

        function handlerA () {return "A"}
        function handlerB () {return "B"}
    })

    test("overwrite original view handlers", function (assert) {

        var rv = {
             el: document.body
            ,rootHandlers: {}
        }

        var ov = {
            handlers: []
        }

        exports.update(rv, ov, {
             id: "R:0"
            ,handlers: [
                 {id:"R:0", type:"onclick", fn:handlerA}
            ]
        })

        assert(ov.handlers[0].fn(), "A")

        function handlerA () {return "A"}
    })

    test("attach delegating event listener", function (assert) {

        var button = document.createElement("button")
        button.setAttribute("data-lymphid", "R:0")
        document.body.appendChild(button)

        var rv = {
             el: document.body
            ,rootHandlers:{}
        }

        exports.update(rv, {}, {
             id: "R:0"
            ,handlers: [
                 {id:"R:0", type:"onclick", fn:handler}
            ]
        })

        simulateClick(button)

        function handler () {
            assert(true)
        }
    })

    function wrap (children) {
        return Views.BODY({}, children)(["R"])
    }

    function simulateClick (el) {
        var event = new MouseEvent("click", {
             "view": window
            ,"bubbles": true
            ,"cancelable": true
        })
        return !el.dispatchEvent(event)
    }

    function setup () {
        document.body.innerHTML = ""
        var ov = wrap([])
        ov.el = document.body
        return ov
    }

    function ignore () {}
}
