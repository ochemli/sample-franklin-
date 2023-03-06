// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

const loadScript = (url, attrs) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (attrs) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const attr in attrs) {
      script.setAttribute(attr, attrs[attr]);
    }
  }
  head.append(script);
  return script;
};

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

//  Load Google Tag Manager
const fireGTM = (w, d, s, l, i) => {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const f = d.getElementsByTagName(s)[0];
  const j = d.createElement(s);
  const dl = l !== 'dataLayer' ? `&l=${l}` : '';
  j.async = true;
  j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
  f.parentNode.insertBefore(j, f);
};

// OneTrust Cookies Consent Notice start
loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
  type: 'text/javascript',
  charset: 'UTF-8',
  'data-domain-script': '078b3e5b-9ab3-4e0f-99e4-1d0b7ff41e53',
});

fireGTM(window, document, 'script', 'dataLayer', 'GTM-NRP6TBV');
window.OptanonWrapper = () => {};
// OneTrust Cookies Consent Notice end
