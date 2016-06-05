exports.xhr = function () {
   return  new XMLHttpRequest()
}

exports.get = function (xhr, url, fn) {
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4){
            if (xhr.getResponseHeader("Content-Type") === "application/json") {
                fn(JSON.parse(xhr.responseText))
            }
            else {
                fn(xhr.responseText)
            }
        }
    }

    xhr.open("GET", url, true)
    xhr.send(null)
}

exports.post = function (xhr, url, data, fn) {
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4){
            if (xhr.getResponseHeader("Content-Type") === "application/json") {
                fn(JSON.parse(xhr.responseText))
            }
            else {
                fn(xhr.responseText)
            }
        }
    }

    xhr.open("POST", url, true)
    xhr.send(JSON.stringify(data))

}

exports.suite = function (test) {

    test("retrieves some json data from a remote server", function (assert) {

        var xhr = fakeXHR([])

        exports.get(xhr, "/json", function (data) {
            assert(data, [])
        })
    })

    test("retrieves text data from a remote server", function (assert) {

        var xhr = fakeXHR("hello")

        exports.get(xhr, "/text", function (data) {
            assert(data, "hello")
        })
    })
}

function fakeXHR (data, type) {
    return {
        readyState: 4,
        getResponseHeader: function () {
            return (type === "json") ?  "application/json" : "text/plain"
        },
        responseText: data,
        onreadystatechange: function () {},
        open: function () {},
        send: function () {
            this.onreadystatechange()
        }
    }
}
