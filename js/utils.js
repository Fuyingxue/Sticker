/**
 * Created by Baron on 2018/4/26.
 */

const log = console.log.bind(console)

var e = (sel) => {
    return document.querySelector(sel)
}

const es = (sel) => {
    return document.querySelectorAll(sel)
}

const appendHtml = (element, html) => {
    element.insertAdjacentHTML('beforeend', html)
}

const bindEvent = (element, eventName, callback) => {
    element.addEventListener(eventName, callback)
}

const bindAll = (selector, eventName, callback) => {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var a = elements[i]
        bindEvent(a, eventName, callback)
    }
}

const removeClassAll = (className) => {
    var selector = '.' + className
    var elements = bindAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var a = elements[i]
        a.classList.remove(className)
    }
}

const toggleClass = (element, className) => {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}
