var forEach = require("mout/array/forEach")
var map = require("mout/array/map")
var partial = require("mout/function/partial")

var ignorePattern = /(^|\s)ignore(\s|$)/

exports.parse = function (rootNode) {
    var data = {}

    forEach(["input", "textarea", "select"], function (name) {
        forEach(rootNode.getElementsByTagName(name), function (node) {
            parseNode(data, node)
        })
    })

    return data
}

function parseName (obj, string, val, filter) {
    var parts = string.split(".")
    var currentName = parts[0]
    var isArray = filter === "[]"

    if (!obj[currentName]) {
        if (isArray) {
            obj[currentName] = []
        }
        else {
            obj[currentName] = {}
        }
    }

    if (parts[1]) {
        var newObjOrArray = obj[currentName]
        parts.splice(0,1)
        var newString = parts.join('.')
        return parseName(newObjOrArray,newString, val, filter)
    }

    var filteredValue = applyFilter(filter, val)

    if (isArray) {
        obj[currentName].push(filteredValue)
    }
    else {
        obj[currentName] = filteredValue
    }
}

function parseNode (obj, node) {

    if (node.name !== "" && node.tagName !== "FIELDSET" && node.className.match(ignorePattern) === null) {
        var filterParts = node.name.split("|")

        if (node.tagName === "BUTTON") {
            var buttonValue = (node.value === "") ? node.innerHTML : node.value
            parseName(obj, filterParts[0], buttonValue, filterParts[1])
        }
        else if (node.tagName.match(/(INPUT|TEXTAREA)/)) {
            if (node.type === "radio") {
                if(node.checked){
                    parseName(obj, filterParts[0], node.value, filterParts[1])
                }
            }
            else if (node.type === "checkbox") {
                if (filterParts[1]) {
                    if (node.checked) {
                        parseName(obj, filterParts[0], node.value, filterParts[1])
                    }
                }
                else{
                    if (node.checked) {
                        parseName(obj, node.name, true)
                    }
                    else {
                        parseName(obj, node.name, false)
                    }
                }
            }
            else {
                parseName(obj, filterParts[0], node.value, filterParts[1])
            }
        }
        else if (node.tagName === "SELECT") {
            parseName(obj, filterParts[0], node.value, filterParts[1])
        }
    }
}

function applyFilter (filter, origValue, isPopulate) {

    if (origValue === "true") {
        return true
    }
    else if (origValue === "false") {
        return false
    }
    else if (filter === "i") {
        return parseInt(origValue, 10)
    }
    else if (filter === "f") {
        return parseFloat(origValue)
    }
    else if (filter === "d") {
        return new Date(origValue)
    }
    else if (filter === "e") {
        return Date.parse(origValue)
    }
    else if (filter === "$") {
        return isPopulate ? pennies2dollar(origValue) : dollar2pennies(origValue)
    }
    else if (filter !== undefined && filter.match(/df:.*/) !== null) {
        return Date.create(origValue).format(filter.split(":")[1])
    }
    else if (filter !== undefined && filter === "df") {
        return Date.create(origValue).format("{MM}/{dd}/{yyyy}")
    }
    else{
        return origValue
    }
}

function pennies2dollar (pennies) {
    return (pennies / 100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function dollar2pennies (dollar) {
    return parseFloat(dollar.replace(/,/g, ""))*100
}

exports.suite = function (test) {

    test("parse 1 input text field", function (assert) {
        var container = setup()
        container.innerHTML = '<input name="name" type="text" value="foo">'

        var rst = exports.parse(container)
        assert(rst, {name:"foo"})
    })

    test("parse 2 input text field", function (assert) {
        var container = setup()
        container.innerHTML = '<input name="name1" type="text" value="foo"><input name="name2" type="text" value="bar">'

        var rst = exports.parse(container)
        assert(rst, {name1:"foo", name2:"bar"})
    })

    test("parse 2 input text at different tree levels", function (assert) {
        var container = setup()
        container.innerHTML = '<div><input name="name1" type="text" value="foo"></div>' +
            '<div><input name="name2" type="text" value="bar"></div>'

        var rst = exports.parse(container)
        assert(rst, {name1:"foo", name2:"bar"})
    })

    test("parse a textarea field", function (assert) {
        var container = setup()
        container.innerHTML = '<textarea name="name1">foo</textarea>'

        var rst = exports.parse(container)
        assert(rst, {name1:"foo"})
    })

    test("parse a checked checkbox field", function (assert) {
        var container = setup()
        container.innerHTML = '<input type="checkbox" name="name1" checked>'

        var rst = exports.parse(container)
        assert(rst, {name1:true})
    })

    test("parse an unchecked checkbox field", function (assert) {
        var container = setup()
        container.innerHTML = '<input type="checkbox" name="name1">'

        var rst = exports.parse(container)
        assert(rst, {name1:false})
    })

    test("parse arrayed fields", function (assert) {
        var container = setup()
        container.innerHTML = '<input name="names|[]" value="foo"><input name="names|[]" value="bar">'

        var rst = exports.parse(container)
        assert(rst, {names:["foo", "bar"]})
    })

    test("parse select fields", function (assert) {
        var container = setup()
        container.innerHTML = '<select name="color">' +
            '<option value="red">Red</option>' +
            '<option value="green" selected>Green</option>' +
            '<option value="blue">Blue</option>' +
        '</select>'

        var rst = exports.parse(container)
        assert(rst, {color:"green"})
    })

    function setup () {
        document.body.innerHTML = ""
        return document.body
    }
}
