'use strict';
function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function addClass(element, option) {
  return element.classList.add(option);
}

function removeClass(element, option) {
  return element.classList.remove(option);
}

function replaceClass(element, current, update) {
  return element.classList.replace(current, update)
}

const outOfFocus = select('.out-of-focus');
const consent = select('.consent');
const acceptAll = select('.accept');
const settingsBtn = select('.settingsbtn');
const settings = select('.settings');
const browser = select('#browser');
const os = select('#os');
const screenWidth = select('#width');
const screenHeight = select('#height');
const saveBtn = select('.save');
const userAgentString = navigator.userAgent;

function displayConsent() {
   replaceClass(consent, 'hidden', 'visible');
   replaceClass(outOfFocus, 'hidden', 'visible');
}

function displaySettings() {
  replaceClass(settings, 'hidden', 'visible');
  replaceClass(consent, 'visible', 'hidden');
}

function getOS() {
  if (userAgentString.includes('Win')) return 'Windows';
  if (userAgentString.includes('Mac')) return 'MacOS';
  if (userAgentString.includes('Linux')) return 'Linux';
  if (/Android/.test(userAgentString)) return 'Android';
  if (/iPhone|iPad|iPod/.test(userAgentString)) return 'iOS';
  return 'Unknown OS';
}

const browserDetectors = [
  { 
    name: 'Chrome', 
    detector: (agent) => agent.includes('Chrome') && !agent.includes('Edg') 
  },
  { 
    name: 'Safari', 
    detector: (agent) => agent.includes('Safari') && !agent.includes('Chrome') 
  },
  { 
    name: 'Firefox', 
    detector: (agent) => agent.includes('Firefox') 
  },
  { 
    name: 'Internet Explorer', 
    detector: (agent) => agent.includes('MSIE') || agent.includes('Trident') 
  },
  { 
    name: 'Opera', 
    detector: (agent) => agent.includes('OPR') || agent.includes('Opera') 
  },
  { 
    name: 'Edge', 
    detector: (agent) => agent.includes('Edg') 
  }
];

function getBrowser() {
  for (const { name, detector } of browserDetectors) {
    if (detector(userAgentString)) {
      return name;
    }
  }
  return 'Unrecognized Browser';
}

const browserType = getBrowser();

function getScreenWidth() {return window.screen.width;}
function getScreenHeight() {return window.screen.height;}

function setCookie(key, value) {
  let encodedKey = encodeURIComponent(key);
  let encodedValue = encodeURIComponent(value);
  document.cookie = `${encodedKey}=${encodedValue}; path=/; max-age=20`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return 'No cookie found';
}

function checkCookies(){
  if (document.cookie.length > 0) return;
  displayConsent();
}
