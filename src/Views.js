/*
 * Views are simply streams of dom changes that can be reconciled with an existing
 * stream.  The side-effect is the ability to apply only changed items to the DOM,
 * thus optimizing the rendering of UI elements
 */
var isObject = require("mout/lang/isObject")
var isArray = require("mout/lang/isArray")
var isString = require("mout/lang/isString")
var forEach = require("mout/array/forEach")
var map = require("mout/array/map")
var forOwn = require("mout/object/forOwn")
var startsWith = require("mout/string/startsWith")
var filterProps = require("mout/object/filter")

var tags = [
    "A", "ABBR", "ACRONYM", "ADDRESS", "AREA", "ARTICLE", "ASIDE", "AUDIO",
    "B", "BDI", "BDO", "BIG", "BLOCKQUOTE", "BODY", "BR", "BUTTON",
    "CANVAS", "CAPTION", "CITE", "CODE", "COL", "COLGROUP", "COMMAND",
    "DATALIST", "DD", "DEL", "DETAILS", "DFN", "DIV", "DL", "DT", "EM",
    "EMBED", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAME",
    "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEAD", "HEADER",
    "HGROUP", "HR", "HTML", "I", "IFRAME", "IMG", "INPUT", "INS", "KBD",
    "KEYGEN", "LABEL", "LEGEND", "LI", "LINK", "MAP", "MARK", "META",
    "METER", "NAV", "NOSCRIPT", "OBJECT", "OL", "OPTGROUP", "OPTION",
    "OUTPUT", "P", "PARAM", "PRE", "PROGRESS", "Q", "RP", "RT", "RUBY",
    "SAMP", "SCRIPT", "SECTION", "SELECT", "SMALL", "SOURCE", "SPAN",
    "SPLIT", "STRONG", "STYLE", "SUB", "SUMMARY", "SUP", "TABLE", "TBODY",
    "TD", "TEXTAREA", "TFOOT", "TH", "THEAD", "TIME", "TITLE", "TR",
    "TRACK", "TT", "UL", "VAR", "VIDEO", "WBR"
]

forEach(tags, function (tagName) {
    exports[tagName] = function (a, b) {
        var properties = {}
        var children = []

        if (isObject(a)) {
            properties = a
        }
        else if (isArray(a)) {
            children = a
        }

        if (isArray(b) || isString(b)) {
            children = b
        }

        return createView(tagName, properties, children)
    }
})

exports.space = "&nbsp;"

function createView (tagName, properties, children) {
    return function (path) {

        var viewId = path.join(":")

        if (properties.lymphId) {
            viewId = path.slice(0, path.length - 1).concat(properties.lymphId).join(":")
            delete properties.lymphId
        }

        var handlers = []
        var attributes = {}

        for (var key in properties) {
            if (startsWith(key, "on")) {
                handlers.push({ id: viewId, type: key, fn: properties[key] })
            }
            else {
                attributes[key] = properties[key]
            }
        }

        if (typeof children === "string") {
            return {
                 id: viewId
                ,name: tagName
                ,attributes: attributes
                ,handlers: handlers
                ,value: children
            }
        }
        else {

            var identifiedChildren = []
            
            if (children) {
                for (var idx = 0; idx < children.length; idx++) {
                    identifiedChildren.push(children[idx](path.concat(idx)))
                }
            }

            return {
                 id: viewId
                ,name: tagName
                ,attributes: attributes
                ,handlers: handlers
                ,children: identifiedChildren
            }
        }
    }
}

exports.suite = function (test) {

    test("create 1 element and no attributes", function (assert) {
        var view = createView("div", {})(["R"])
        assert(view, {id:"R", name: "div", attributes: {}, handlers:[], children: []})
    })

    test("create 1 element and 2 attributes", function (assert) {
        var view = createView("div", {class:"foo", style:"color:blue;"})(["R"])
        assert(view, {id:"R", name:"div", attributes:{class:"foo", style:"color:blue;"} , handlers:[], children: []})
    })

    test("create 1 element and 2 child elements", function (assert) {
        var view = createView("div", {}, [
             createView("div", {})
            ,createView("div", {})
        ])(["R"])

        assert(view, {id: "R", name:"div", attributes:{}, handlers:[], children: [
             {id: "R:0", name: "div", attributes: {}, handlers:[], children: []}
            ,{id: "R:1", name: "div", attributes: {}, handlers:[], children: []}
        ]})
    })

    test("create 1 element with a text child", function (assert) {
        var view = createView("div", {}, "text")(["R"])
        assert(view, {id: "R", name:"div", attributes:{}, handlers:[], value: "text"})
    })

    test("create 1 element with a meaningful lymphid", function (assert) {
        var view = createView("div", {}, [
             createView("div", {lymphId: "abc"})
        ])(["R"])
        assert(view, {id: "R", name:"div", attributes:{}, handlers:[], children: [
             {id: "R:abc", name: "div", attributes: {}, handlers:[], children: []}
        ]})
    })

    test("create 1 element with event handlers", function (assert) {
        var v = exports
        var view = v.DIV({}, [
             v.DIV({onclick:clickHandler}, [
                 v.DIV({}, "DIV1")
                ,v.DIV({}, "DIV2")
            ])
        ])(["R"])

        assert(view, {id: "R", name:"DIV", attributes:{}, handlers:[], children: [
             { id: "R:0", name: "DIV", attributes: {}, handlers:[{id:"R:0", type:"onclick"}], children: [
                 { id:"R:0:0", name:"DIV", attributes:{}, handlers:[], value:"DIV1"}
                ,{ id:"R:0:1", name:"DIV", attributes:{}, handlers:[], value:"DIV2"}
            ]}
        ]})

        function clickHandler () {}
    })

    test("optional properties parameter", function (assert) {
        var view = exports.DIV()(["R"])
        assert(view, {id:"R", name:"DIV", attributes:{}, handlers:[], children:[] })
    })

    function sequencialIdCreator () {
        var count = 0
        return function () {
            return (++count).toString()
        }
    }
}
