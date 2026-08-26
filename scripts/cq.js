const setCookieFunction = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  let domain_parts = (window.location.hostname + '').split('.');
  domain_parts.shift();
  let domain = "";
  domain = "; domain=." + domain_parts.join('.');
  document.cookie = name + "=" + value + expires + domain + "; path=/";
  window.location.reload();
};

const getLanguage = () => {
  // Fonction utilitaire pour normaliser les codes de langue
  const normalizeLang = (lang) => {
    if (!lang) return null;

    const lower = lang.toLowerCase();

    if (lower === 'fr' || lower.startsWith('fr-')) {
      return 'fr-ca';
    }

    if (lower === 'en' || lower.startsWith('en-')) {
      return 'en';
    }

    return null;
  };

  // On essaye d'abord de récupérer la langue depuis le cookie
  const languageCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('openedx-language-preference='));
  const languageFromCookie = languageCookie ? decodeURIComponent(languageCookie.split('=')[1]) : null;
  const fromCookie = normalizeLang(languageFromCookie);
  if (fromCookie) return fromCookie;

  // Ensuite, on essaye de récupérer la langue depuis le navigateur
  const browserLang = navigator.languages?.[0] || navigator.language || null;
  const fromBrowser = normalizeLang(browserLang);
  if (fromBrowser) return fromBrowser;

  // Par défaut, on retourne 'fr-ca'
  return 'fr-ca';
};

const language = getLanguage();

const langIsFrench = () => {
  return language === "fr-ca" || language === "fr";
};

const toggleLanguage = () => {
  if (langIsFrench()) {
    setCookieFunction('openedx-language-preference', 'en', 14);
  }
  else {
    setCookieFunction('openedx-language-preference', 'fr-ca', 14);
  }
}
window.ckySettings = {documentLang: getLanguage()};

if (document.URL.split('/').pop() == 'welcome' && language == 'en') {
  labels = document.getElementsByClassName('pgn__form-control-floating-label-text');
  labels[0].textContent = 'Academic position';
  labels[1].textContent = 'Research area';
  labels2 = document.getElementsByClassName('pgn__form-label');
  labels2[0].textContent = 'Subscribe to the newsletter';
  
  
  positionSelector = document.getElementById('position');
  positionSelector.options[0].text = 'Academic position';
  positionSelector.options[2].text = 'Undergrad student';
  positionSelector.options[3].text = 'Master student';
  positionSelector.options[4].text = 'Doctoral student';
  positionSelector.options[5].text = 'Post-doctoral student';
  positionSelector.options[6].text = 'Professor';
  positionSelector.options[7].text = 'Research professional';
  positionSelector.options[8].text = 'Other';
  
  researchAreaSelector = document.getElementById('research_area');
  researchAreaSelector.options[0].text = 'Research area';
  researchAreaSelector.options[2].text = 'Natural sciences';
  researchAreaSelector.options[3].text = 'Engineering and technology';
  researchAreaSelector.options[4].text = 'Medical and health sciences';
  researchAreaSelector.options[5].text = 'Agricultural and veterinary sciences';
  researchAreaSelector.options[6].text = 'Social sciences';
  researchAreaSelector.options[7].text = 'Humanities and the arts';
}
