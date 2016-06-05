var forEach = require("mout/array/forEach")
var filter = require("mout/array/filter")

exports.create = function () {

    return {
         listen: function (type, fn) {
            document.addEventListener(type, function(event) {
                fn(event.detail)
            })
        }
        ,send: function (type, data) {

            var anEvent = new CustomEvent(type, {
                 detail: data
                ,bubbles: true
                ,cancelable: false
            })

            document.dispatchEvent(anEvent)
        }
    }
}

exports.suite = function (test) {}
