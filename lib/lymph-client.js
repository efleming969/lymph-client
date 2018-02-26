var lymphClient = (function (exports) {
'use strict';

const generateId = (function () {
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ID_LENGTH = 8;
    return function () {
        let rtn = "";
        for (let i = 0; i < ID_LENGTH; i++) {
            rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
        }
        return rtn;
    };
})();
const objectFromPair = function (pair) {
    const obj = {};
    obj[pair[0]] = pair[1];
    return obj;
};
const merge = function (obj1, obj2) {
    return Object.assign({}, obj1, obj2);
};
const dispatchAction = function (window) {
    return function (event) {
        window.dispatchEvent(new window.CustomEvent("action", { detail: event, bubbles: true, cancelable: true }));
    };
};
const evolve = function (transformations, object) {
    const result = {};
    for (const key in object) {
        let transformation = transformations[key];
        if (typeof transformation === "function") {
            result[key] = transformation(object[key]);
        }
        else if (typeof transformation === "object") {
            result[key] = evolve(transformation, object[key]);
        }
        else {
            result[key] = object[key];
        }
    }
    return result;
};
const currentTarget = function (message) {
    return message.event.currentTarget;
};
const forEach = function (fn, iterable) {
    for (let i = 0; i < iterable.length; i++) {
        fn(iterable[i]);
    }
};
const extractFormData = function (form) {
    const fields = {};
    const copyProp = function (element, propName) {
        fields[element.name] = element[propName];
    };
    forEach(function (element) {
        if (element.type === "text" || element.type === "password") {
            copyProp(element, "value");
        }
        else if (element.type === "radio" && element.checked) {
            copyProp(element, "value");
        }
        else if (element.type === "checkbox") {
            copyProp(element, "checked");
        }
        else if (element.nodeName === "SELECT") {
            copyProp(element, "value");
        }
    }, form.elements);
    return fields;
};
const currentForm = function (message) {
    return extractFormData(currentTarget(message));
};
const find = function (array, condition) {
    let result;
    for (let i = 0; i < array.length; i++) {
        if (condition(array[i])) {
            return array[i];
        }
    }
    return result;
};
const mapObjectToArray = function (object, fn) {
    return Object.keys(object).map(function (key) {
        return fn(key, object[key]);
    });
};
const extractMessage = function (parent_message, message) {
    return merge(message, { name: message.name.replace(":" + parent_message, "") });
};
const createUpdater = function (routeDefinitions) {
    return function (message, state) {
        for (let name in routeDefinitions) {
            if (message.name.indexOf(":" + name) === 0) {
                return routeDefinitions[name](extractMessage(name, message), state);
            }
        }
        return [state, undefined];
    };
};
const createContext = function (names = []) {
    return {
        createComponent: function (component, component_name) {
            const { init, updater, render } = component.create(createContext(names.concat(component_name)));
            return { init, update: createUpdater(updater), render };
        },
        send: function (name) {
            return ":" + names.slice(1).concat(name).join(":");
        }
    };
};
const createActionHandler = window => function (action, callback) {
    window.addEventListener("action", function (e) {
        if (e["detail"].name === action)
            callback(e["detail"]);
    });
};


var Utils = Object.freeze({
	generateId: generateId,
	objectFromPair: objectFromPair,
	merge: merge,
	dispatchAction: dispatchAction,
	evolve: evolve,
	currentTarget: currentTarget,
	extractFormData: extractFormData,
	currentForm: currentForm,
	find: find,
	mapObjectToArray: mapObjectToArray,
	createUpdater: createUpdater,
	createContext: createContext,
	createActionHandler: createActionHandler
});

const convertProperties = function (propsIn) {
    const propsOut = {};
    for (let propName in propsIn) {
        if (propName === "classes") {
            let classes = [];
            for (let className in propsIn.classes) {
                if (propsIn.classes[className]) {
                    classes.push(className);
                }
            }
            propsOut.className = classes.join(" ");
        }
        else {
            propsOut[propName] = propsIn[propName];
        }
    }
    return propsOut;
};
const convertChildren = function (children) {
    if (typeof children === "string") {
        return [children];
    }
    else {
        return children;
    }
};
const create = function (tagName) {
    tagName = tagName.toUpperCase();
    return function (properties = {}, children = []) {
        return {
            tagName,
            properties: convertProperties(properties),
            children: convertChildren(children)
        };
    };
};
const h1 = create("h1");
const h2 = create("h2");
const h3 = create("h3");
const hr = create("hr");
const a = create("a");
const p = create("p");
const div = create("div");
const span = create("span");
const ul = create("ul");
const li = create("li");
const form = create("form");
const input = create("input");
const button = create("button");
const select = create("select");
const label = create("label");
const fieldset = create("fieldset");
const body = create("body");
const section = create("section");
const header = create("header");
const footer = create("footer");
const main = create("main");
const canvas = create("canvas");
const textBox = (name, value) => input({ type: "text", name: name, value: value });
const link = (href, text) => a({ href }, [text]);
const buildFormField = function (field) {
    return div({}, [
        label({ for: field.id }, [field.label]),
        input({ type: field.type, id: field.id, name: field.id, value: field.value || "" })
    ]);
};


var HTML = Object.freeze({
	h1: h1,
	h2: h2,
	h3: h3,
	hr: hr,
	a: a,
	p: p,
	div: div,
	span: span,
	ul: ul,
	li: li,
	form: form,
	input: input,
	button: button,
	select: select,
	label: label,
	fieldset: fieldset,
	body: body,
	section: section,
	header: header,
	footer: footer,
	main: main,
	canvas: canvas,
	textBox: textBox,
	link: link,
	buildFormField: buildFormField
});

const fetchHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
};
const createFetchOptions = function (method, token, data) {
    const headers = merge(fetchHeaders, token ? { "Authorization": token } : {});
    const body = data ? JSON.stringify(data) : null;
    return { method, headers, body };
};
class HTTP {
    constructor(fetch) {
        this.fetch = fetch;
    }
    post(path, data, auth_token) {
        const options = createFetchOptions("POST", auth_token, data);
        return this.fetch(path, options).then(function (response) {
            return response.json().then(function (data) {
                if (response.status === 400)
                    throw data;
                return data;
            });
        });
    }
    get(path, auth_token) {
        const options = createFetchOptions("GET", auth_token, null);
        return this.fetch(path, options).then(function (response) {
            return response.json().then(function (data) {
                if (response.status === 400)
                    throw data;
                return data;
            });
        });
    }
}


var HTTP$1 = Object.freeze({
	createFetchOptions: createFetchOptions,
	default: HTTP
});

const createNodeFrom = function (window, spec) {
    let element = null;
    if (typeof spec === "string") {
        element = window.document.createTextNode(spec);
    }
    else {
        element = window.document.createElement(spec.tagName);
        updateProperties(window, element, spec);
        for (let i = 0, len = spec.children.length; i < len; i++) {
            element.appendChild(createNodeFrom(window, spec.children[i]));
        }
    }
    return element;
};
const updateChildren = function (window, oldNode, spec) {
    let oldLength = oldNode.childNodes.length;
    let newLength = spec.children.length;
    for (let i1 = 0; i1 < newLength; i1++) {
        patch(window, oldNode, oldNode.childNodes[i1], spec.children[i1]);
    }
    for (let i2 = 0; i2 < (oldLength - newLength); i2++) {
        oldNode.removeChild(oldNode.lastChild);
    }
};
const updateProperties = function (window, oldNode, spec) {
    if (oldNode._properties) {
        for (let propName of oldNode._properties) {
            if (propName.startsWith("on"))
                oldNode[propName] = function () {
                };
        }
    }
    oldNode._properties = [];
    for (let propName in spec.properties) {
        oldNode._properties.push(propName);
        if (propName.startsWith("on")) {
            oldNode[propName] = (function ([name, data]) {
                return function (event) {
                    const lymph_config = window["lymphConfig"] || { actionName: "action" };
                    this.dispatchEvent(new window["CustomEvent"](lymph_config.actionName, {
                        detail: { name, data, event },
                        bubbles: true,
                        cancelable: true
                    }));
                };
            })(spec.properties[propName]);
        }
        else if (oldNode[propName] !== spec.properties[propName]) {
            oldNode[propName] = spec.properties[propName];
        }
    }
};
const patch = function (window, parent, oldNode, spec) {
    if (oldNode === undefined) {
        parent.appendChild(createNodeFrom(window, spec));
    }
    else {
        if (typeof spec === "string" && oldNode.nodeType === Node.TEXT_NODE) {
            if (oldNode.nodeValue !== spec) {
                oldNode.nodeValue = spec;
            }
        }
        else if (oldNode.nodeType === Node.ELEMENT_NODE) {
            if (oldNode.tagName !== spec.tagName) {
                parent.replaceChild(createNodeFrom(window, spec), oldNode);
            }
            else {
                updateProperties(window, oldNode, spec);
                updateChildren(window, oldNode, spec);
            }
        }
        else if (oldNode.nodeType === Node.TEXT_NODE) {
            parent.replaceChild(createNodeFrom(window, spec), oldNode);
        }
        else {
            throw "unknown node";
        }
    }
};


var DOM = Object.freeze({
	updateChildren: updateChildren,
	patch: patch
});

class WindowEnvironment {
    constructor(window) {
        this.window = window;
    }
    fetch(path, options) {
        return this.window.fetch(path, options);
    }
    changeLocation(path) {
        this.window.location.assign(path);
    }
    writeStorage(location, data) {
        this.window.localStorage.setItem(location, data);
    }
    readStorage(location) {
        return this.window.localStorage.getItem(location);
    }
    dispatch(action_name, data) {
        const action_event = new this.window.CustomEvent("action", {
            detail: { name: action_name, data },
            bubbles: true,
            cancelable: true
        });
        this.window.dispatchEvent(action_event);
    }
}

const run = function (window, app_component, app_name) {
    const environment = new WindowEnvironment(window);
    const context = createContext();
    const app = context.createComponent(app_component, app_name);
    let [viewState, command] = app.init(window.location.hash.slice(1));
    console.group("%c", "color: gray; font-weight: lighter;", ":init");
    console.log("%c next state", "color: #4CAF50; font-weight: bold;", viewState);
    console.log("%c commands", "color: #4CAF50; font-weight: bold;", command);
    console.groupEnd();
    let view = app.render(viewState);
    const lymph_config = window["lymphConfig"] || {
        actionName: "action"
    };
    window.addEventListener(lymph_config.actionName, function (e) {
        console.group("%c", "color: gray; font-weight: lighter;", e.detail.name);
        console.log("%c prev state", "color: #9E9E9E; font-weight: bold;", viewState);
        console.log("%c message", "color: #03A9F4; font-weight: bold;", e.detail);
        const [state, command] = app.update(e.detail, viewState);
        console.log("%c next state", "color: #4CAF50; font-weight: bold;", state);
        console.log("%c commands", "color: #4CAF50; font-weight: bold;", command);
        viewState = state;
        view = app.render(viewState);
        updateChildren(window, window.document.body, view);
        command.executeIn(environment);
        console.groupEnd();
    });
    window.addEventListener("hashchange", function (e) {
        window.document.dispatchEvent(new window["CustomEvent"](lymph_config.actionName, {
            detail: { name: `:route-changed`, data: window.location.hash.slice(1) },
            bubbles: true,
            cancelable: true
        }));
    });
    // because we never want to do standard submits in SPAs
    window.document.addEventListener("submit", e => e.preventDefault(), true);
    updateChildren(window, window.document.body, view);
    command.executeIn(environment);
};


var Lymph = Object.freeze({
	run: run
});

class Execute {
    constructor(url, data, action, token) {
        this.url = url;
        this.data = data;
        this.action = action;
        this.token = token;
    }
    executeIn(environment) {
        const fetch_options = createFetchOptions("POST", this.token, this.data);
        const action_name = this.action;
        environment.fetch(this.url, fetch_options).then(function (response) {
            return response.json().then(function (response_data) {
                if (response.status === 400)
                    throw response_data;
                environment.dispatch(action_name, response_data);
            });
        });
    }
}
const execute = function (url, data, action, token) {
    return new Execute(url, data, action, token);
};
class Query {
    constructor(url, action, token) {
        this.url = url;
        this.action = action;
        this.token = token;
    }
    executeIn(environment) {
        const fetch_options = createFetchOptions("GET", this.token, null);
        const action_name = this.action;
        environment.fetch(this.url, fetch_options).then(function (response) {
            return response.json().then(function (response_data) {
                if (response.status === 400)
                    throw response_data;
                environment.dispatch(action_name, response_data);
            });
        });
    }
}
const query = function (url, action, token) {
    return new Query(url, action, token);
};
class ReadStorage {
    constructor(location, action) {
        this.location = location;
        this.action = action;
    }
    executeIn(environment) {
        const data = JSON.parse(environment.readStorage(this.location));
        environment.dispatch(this.action, data);
    }
}
const read = function (location, action) {
    return new ReadStorage(location, action);
};
class WriteStorage {
    constructor(location, data, action) {
        this.location = location;
        this.data = data;
        this.action = action;
    }
    executeIn(environment) {
        environment.writeStorage(this.location, JSON.stringify(this.data));
        if (this.action)
            environment.dispatch(this.action, this.data);
    }
}
const write = function (location, data, action) {
    return new WriteStorage(location, data, action);
};
class Redirect {
    constructor(path) {
        this.path = path;
    }
    executeIn(environment) {
        environment.changeLocation(this.path);
    }
}
const redirect = function (path) {
    return new Redirect(path);
};
class None {
    executeIn(environment) {
    }
}
const none = new None();


var Command = Object.freeze({
	Execute: Execute,
	execute: execute,
	Query: Query,
	query: query,
	ReadStorage: ReadStorage,
	read: read,
	WriteStorage: WriteStorage,
	write: write,
	Redirect: Redirect,
	redirect: redirect,
	None: None,
	none: none
});

exports.Utils = Utils;
exports.HTML = HTML;
exports.HTTP = HTTP$1;
exports.Lymph = Lymph;
exports.Command = Command;
exports.DOM = DOM;

return exports;

}({}));
