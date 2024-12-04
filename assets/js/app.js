'use strict';
function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

function select(selector, scope = document) {
  return scope.querySelector(selector);
}