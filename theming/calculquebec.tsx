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
  if (fromCookie) {
    if (fromCookie != languageFromCookie) setCookieFunction('openedx-language-preference', fromCookie, 14);
    return fromCookie;
  }

  // Ensuite, on essaye de récupérer la langue depuis le navigateur
  const browserLang = navigator.languages?.[0] || navigator.language || null;
  const fromBrowser = normalizeLang(browserLang);
  if (fromBrowser) {
    if (fromBrowser != browserLang) setCookieFunction('openedx-language-preference', fromBrowser, 14);
    return fromBrowser;
  }

  // Par défaut, on retourne 'fr-ca'
  return 'fr-ca';
};

const language = getLanguage();

const langIsFrench = () => {
  return language === "fr-ca";
};

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

const toggleLanguage = () => {
  if (langIsFrench()) {
    setCookieFunction('openedx-language-preference', 'en', 14);
  }
  else {
    setCookieFunction('openedx-language-preference', 'fr-ca', 14);
  }
}

const pageTitle = document.title;

const pageBack = () => {
  window.history.back();
};


const languages = {
  "fr-ca": {
    help: "Aide",
    contact: "NOUS CONTACTER",
    about: "À propos",
    terms: "Conditions d'utilisation",
    policies: "Politiques et publications",
    poweredBy: "Propulsé par",
    wiki: "WIKI TECHNIQUE",
    serverstatus: "ETAT DES SERVEURS",
    bulletins: "BULLETINS D'INFORMATION",
    langswitch: "ENGLISH",
    langswitchcode: 'javascript:setLanguage("en")',
    bannerwelcome: "Bienvenue sur evolo",
    bannerplatform: "la plateforme de formation gratuite de Calcul Québec destinée à la communauté de la recherche.",
    bannercomeback: "Revenez régulièrement : de nouveaux cours sont en préparation !",
  },
  en: {
    help: "Help",
    contact: "CONTACT US",
    about: "About",
    terms: "Terms of use",
    policies: "Policies and publications",
    poweredBy: "Powered by",
    wiki: 'TECHNICAL WIKI',
    serverstatus: "SERVER STATUS",
    bulletins: "SUBSCRIBE TO OUR NEWSLETTERS",
    langswitch: "FRANÇAIS",
    langswitchcode: 'javascript:setLanguage("fr-ca")',
    bannerwelcome: "Welcome to evolo",
    bannerplatform: "Calcul Québec's free learning platform aimed at the research community.",
    bannercomeback: "Come back often: new content is being prepared!",
  },
};