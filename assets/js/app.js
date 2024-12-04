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

function hideModal() {
  replaceClass(consent, 'visible', 'hidden');
  replaceClass(outOfFocus, 'visible', 'hidden');
  replaceClass(settings, 'visible', 'hidden');
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
  const encodedName = encodeURIComponent(name);
  const match = document.cookie.match(new RegExp("(^| )" + encodedName + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
  return;
}

function checkCookies(){
  if (document.cookie.length > 0) return;
  displayConsent();
}

function setCustomCookies() {
  const checkboxes = [browser, os, screenWidth, screenHeight];
  const noneChecked = checkboxes.every(checkbox => !checkbox.checked);

  if (browser.checked) { setCookie('Browser', browserValue); }
  if (os.checked) { setCookie('OS', osType); }
  if (screenWidth.checked) { setCookie('Screen Width', screenWidthValue); }
  if (screenHeight.checked) { setCookie('Screen Height', screenHeightValue); }
  if (noneChecked) { setCookie('Cookies', 'None'); }
}

function printCookies() {
  if (getCookie('OS') != null) { console.log(`OS: ${getCookie('OS')}`); }
  if (getCookie('Browser') != null) { 
    console.log(`Browser: ${getCookie('Browser')}`); 
  }
  if (getCookie('Screen Width') != null) { 
    console.log(`Screen Width: ${getCookie('Screen Width')}`); 
  }
  if (getCookie('Screen Height') != null) { 
    console.log(`Screen Height: ${getCookie('Screen Height')}`); 
  }

  if (getCookie('Cookies') != null) { console.log('Cookies Not Enabled'); }
}

let osType = getOS();
let screenWidthValue = getScreenWidth();
let screenHeightValue = getScreenHeight();
let browserValue = getBrowser();


listen('load', window, () => {
  checkCookies();
  printCookies();
});

listen('click', acceptAll, () => {
  setCookie('OS', osType);
  setCookie('Browser', browserValue);
  setCookie('Screen Width', screenWidthValue);
  setCookie('Screen Height', screenHeightValue);
  hideModal();
  printCookies();
});

listen('click', settingsBtn, displaySettings);

listen('click', saveBtn, () => {
  setCustomCookies(); 
  printCookies();
  hideModal();
});

