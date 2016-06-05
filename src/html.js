var Views = require("./Views")
var Handlers = require("./Handlers")

var forEach = require("mout/array/forEach")
var forOwn = require("mout/object/forOwn")
var filter = require("mout/array/filter")
var hyphenify = require("mout/string/hyphenate")

exports.updateView = function updateView (rootOrgView, rootNewView) {

    rootOrgView.rootHandlers = rootOrgView.rootHandlers || []

    _updateView(rootOrgView, rootNewView)

    function _updateView (orgView, newView) {

        removeMissingChildren(orgView, newView)
        updateAttributes(orgView, newView)
        Handlers.update(rootOrgView, orgView, newView)

        checkForMissingElements(newView)

        forEach(newView.children, function childIterator (child, i) {

            var orgChild = orgView.children[i]

            if (orgChild === undefined) {
                orgChild = insert(orgView, child)
            }
            else if (orgChild.name !== child.name) {
                orgChild = insert(orgView, child, orgChild)
            }
            else if (child.value !== undefined) {
                if (orgChild.value !== child.value) {
                    orgChild.value = child.value
                    if (orgChild.value === "&nbsp;") {
                        orgChild.el.textContent = "\u00A0"
                    }
                    else {
                        orgChild.el.textContent = child.value
                    }
                }
            }

            _updateView(orgChild, child)

        })
    }
}

function checkForMissingElements (view) {
    if (view.children &&
        view.children.length > 0 &&
        view.children[0] === undefined)
        throw new Error("missing element in children for " + view.id)
}

function removeMissingChildren (orgView, newView) {

    if (orgView.children && newView.value !== undefined) {
        orgView.el.innerHTMl = ""
        delete orgView.children
    }
    else {
        forEach(orgView.children, function (child, i) {
            if (!newView.children[i]) {
                orgView.el.removeChild(child.el)
            }
        })
    }

    var newOrgChildren = filter(orgView.children, function (child, i) {
        return newView.children[i]
    })

    orgView.children = newOrgChildren
}

function insert (parentView, view, childToReplace) {

    var el = document.createElement(view.name)

    var viewToInsert = {
         id: view.id
        ,name: view.name
        ,attributes: view.attributes
        ,handlers: view.handlers
        ,el: el
    }

    setElementAttributes(viewToInsert)
    el.setAttribute("data-lymphid", view.id)

    if (childToReplace && typeof childToReplace === "object") {
        parentView.children.splice(parentView.children.indexOf(childToReplace), 1, viewToInsert)
        parentView.el.replaceChild(viewToInsert.el, childToReplace.el)
    }
    else {
        parentView.children.push(viewToInsert)
        parentView.el.appendChild(viewToInsert.el)
    }

    if (view.value) {
        viewToInsert.value = view.value
        if (view.value === "&nbsp;") {
            viewToInsert.el.appendChild(document.createTextNode('\u00A0'))
        }
        else {
            viewToInsert.el.appendChild(document.createTextNode(viewToInsert.value))
        }
    }
    else {
        viewToInsert.children = []
    }

    return viewToInsert
}

function setElementAttributes (view) {
    forOwn(view.attributes, function (value, name) {
        if (name === "className") {
            view.el.setAttribute("class", value)
        }
        else {
            view.el.setAttribute(hyphenify(name), value) 
        }
    }, view.attributes)
}

function updateAttributes (orgView, newView) {

    if (orgView.id !== newView.id) {
        orgView.id = newView.id
        orgView.el.setAttribute("data-lymphid", newView.id)
    }

    forOwn(orgView.attributes, function (value, name) {
        if (orgView.attributes[name] && !newView.attributes[name]) {
            delete orgView.attributes[name]
            if (name === "className") {
                orgView.el.className = ""
            }
            else {
                orgView.el.removeAttribute(hyphenify(name))
            }
        }
    })

    for (var name in newView.attributes) {
        if (name === "value" && orgView.el.value !== newView.attributes.value) {
            orgView.attributes.value = newView.attributes.value
            orgView.el.value = newView.attributes.value
        }
        else if (name === "className" && orgView.el.className !== newView.attributes.className) {
            orgView.attributes.className = newView.attributes.className
            orgView.el.setAttribute("class", newView.attributes.className)
        }
        else if (name === "disabled") {
            orgView.attributes.disabled = newView.attributes.disabled
            orgView.el.disabled = newView.attributes.checked
        }
        else if (name === "checked") {
            orgView.attributes.checked = newView.attributes.checked
            orgView.el.checked = newView.attributes.checked
        }
        else if (orgView.attributes[name] !== newView.attributes[name]) {
            orgView.attributes[name] = newView.attributes[name]
            orgView.el.setAttribute(hyphenify(name), newView.attributes[name])
        }
    }
}

exports.suite = function (test) {

    var rootPath = ["R"]
    var updateView = exports.updateView

    test("insert 1 element into root node", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.DIV({})
        ]))
        assert(ov.el.innerHTML, '<div data-lymphid="R:0"></div>')
    })

    test("insert 2 elements into root node", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.DIV({})
            ,Views.DIV({})
        ]))
        assert(ov.el.innerHTML, '<div data-lymphid="R:0"></div><div data-lymphid="R:1"></div>')
    })

    test("insert 1 element with text into root node", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
            Views.DIV({}, "text")
        ]))
        assert(ov.el.innerHTML, '<div data-lymphid="R:0">text</div>')
    })

    test("insert 1 element with attributes into root node", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
            Views.DIV({className:"foo"})
        ]))
        assert(ov.el.innerHTML, '<div class="foo" data-lymphid="R:0"></div>')
    })

    test("insert 1 child element into an existing parent element", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.UL({})
        ]))
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({})
            ])
        ]))
        assert(ov.el.innerHTML, '<ul data-lymphid="R:0"><li data-lymphid="R:0:0"></li></ul>')
    })

    test("insert 1 new sibling element into an existing parent element", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({})
            ])
        ]))
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({})
                ,Views.LI({})
            ])
        ]))
        assert(ov.el.innerHTML, '<ul data-lymphid="R:0"><li data-lymphid="R:0:0"></li><li data-lymphid="R:0:1"></li></ul>')
    })

    test("delete 1 element from root node with unique id", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({lymphId:"aaa"}, "li1")
                ,Views.LI({lymphId:"bbb"}, "li2")
            ])
        ]))
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({lymphId:"bbb"}, "li2")
            ])
        ]))
        assert(ov.el.innerHTML, '<ul data-lymphid="R:0"><li data-lymphid="R:0:bbb">li2</li></ul>')
    })

    test("delete 1 element from root node", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({}, "li1")
                ,Views.LI({}, "li2")
            ])
        ]))
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({}, "li1")
            ])
        ]))
        assert(ov.el.innerHTML, '<ul data-lymphid="R:0"><li data-lymphid="R:0:0">li1</li></ul>')
    })

    test("delete last child element from a node", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({}, "li1")
            ])
        ]))
        updateView(ov, buildView([
             Views.UL({}, [])
        ]))
        assert(ov.el.innerHTML, '<ul data-lymphid="R:0"></ul>')
    })

    test("changing an existing node's attributes", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.SPAN({className:"foo"})
        ]))
        updateView(ov, buildView([
             Views.SPAN({className:"bar"})
        ]))
        assert(ov.el.innerHTML, '<span class="bar" data-lymphid="R:0"></span>')
    })

    test("adding a new attribute an existing node", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({})
                ,Views.LI({})
            ])
        ]))
        updateView(ov, buildView([
             Views.UL({}, [
                 Views.LI({})
                ,Views.LI({className:"blue"})
            ])
        ]))
        assert(ov.el.innerHTML, '<ul data-lymphid="R:0"><li data-lymphid="R:0:0">'+
            '</li><li data-lymphid="R:0:1" class="blue"></li></ul>')
    })

    test("change the text of 1 element", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.SPAN({}, "foo")
        ]))
        updateView(ov, buildView([
             Views.SPAN({}, "bar")
        ]))
        assert(ov.el.innerHTML, '<span data-lymphid="R:0">bar</span>')
    })

    test("changing the value of an input element", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.INPUT({type:"text", value:"default"})
        ]))
        ov.children[0].el.value = "notit"
        updateView(ov, buildView([
             Views.INPUT({type:"text", value:"updated"})
        ]))
        assert(ov.children[0].el.value, "updated")
    })

    test("replacing an element with another", function (assert) {
        var ov = setup() 
        updateView(ov, buildView([
             Views.SPAN({}, "foo")
        ]))
        updateView(ov, buildView([
             Views.INPUT({value:"foo"})
        ]))
        assert(ov.el.innerHTML, '<input value="foo" data-lymphid="R:0">')
    })

    test("enable a button element", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.BUTTON({disabled:true}, "foo")
        ]))
        updateView(ov, buildView([
             Views.BUTTON({disabled:false}, "foo")
        ]))
        assert(ov.el.childNodes[0].disabled === false)
    })

    test("unchecking an checkbox", function (assert) {
        var ov = setup()
        updateView(ov, buildView([
             Views.INPUT({type:"checkbox", checked:true})
        ]))
        updateView(ov, buildView([
             Views.INPUT({type:"checkbox", checked:false})
        ]))
        assert(ov.el.childNodes[0].checked === false)
    })

    test("rendering content on document.body", function (assert) {
        var ov = setupBody()
        updateView(ov, wrap([
             Views.DIV({}, "foobar")
        ]))
        assert(document.body.innerHTML, '<div data-lymphid="R:0">foobar</div>')
    })

    test("removing 2 child nodes", function (assert) {
        var ov = setupBody()
        updateView(ov, wrap([
             Views.DIV({}, "1")
            ,Views.DIV({}, "2")
            ,Views.DIV({}, "3")
        ]))
        updateView(ov, wrap([
            Views.DIV({}, "3")
        ]))
        assert(document.body.innerHTML, '<div data-lymphid="R:0">3</div>')
    })

    test("insert non-breaking spaces", function (assert) {
        var ov = setupBody()
        updateView(ov, wrap([
             Views.DIV({}, "&nbsp;")
        ]))
        assert(document.body.innerHTML, '<div data-lymphid="R:0">&nbsp;</div>')
    })

    test("update non-breaking spaces", function (assert) {
        var ov = setupBody()
        updateView(ov, wrap([
             Views.DIV({}, "xxx")
        ]))
        updateView(ov, wrap([
             Views.DIV({}, "&nbsp;")
        ]))
        assert(document.body.innerHTML, '<div data-lymphid="R:0">&nbsp;</div>')
    })

    test("updating a text node to empty when previous was not empty", function (assert) {
        var ov = setupBody()
        updateView(ov, wrap([
             Views.DIV({}, "A")
        ]))
        updateView(ov, wrap([
             Views.DIV({}, "")
        ]))
        assert(document.body.innerHTML, '<div data-lymphid="R:0"></div>')
    })

    test("remove element when new view has a value", function (assert) {
        var ov = setupBody()
        updateView(ov, wrap([
             Views.DIV({}, [
                 Views.DIV({}, "inner")
            ])
        ]))

        updateView(ov, wrap([
             Views.DIV({}, "")
        ]))

        assert(document.body.innerHTML, '<div data-lymphid="R:0"></div>')
    })

    test("removing all classes", function (assert) {
        var ov = setupBody()
        updateView(ov, wrap([
             Views.DIV({className:"foo"}, "")
        ]))

        updateView(ov, wrap([
             Views.DIV({}, "")
        ]))

        assert(document.body.innerHTML, '<div class="" data-lymphid="R:0"></div>')
    })

    function ignore () {}

    function wrap (children) {
        return Views.BODY({}, children)(["R"])
    }

    function setupBody () {
        document.body.innerHTML = ""
        var ov = wrap([])
        ov.el = document.body
        return ov
    }

    function setup () {
        var node = document.getElementById("container")
        node.innerHTML = ""
        var ov = buildView([])
        ov.el = node
        return ov
    }

    function buildView (children) {
        return Views.DIV({id:"container"}, children)(rootPath)
    }
}
