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

const language = getLanguage();

const pageTitle = document.title;

const langIsFrench = () => {
  return language === "fr-ca" || language === "fr";
};

const pageBack = () => {
  window.history.back();
};

return (
  <>
    <script src='https://kit.fontawesome.com/91003a351d.js' crossorigin='anonymous'></script>
    <div>
      <div class='banner'>
        <div class='cover-filter'></div>
        <img
          src={
            langIsFrench()
              ? 'https://raw.githubusercontent.com/calculquebec/tutor-plugins/refs/heads/cq/ulmo.dev/theming/templates/lms/static/images/logo_bandeau.png'
              : 'https://raw.githubusercontent.com/calculquebec/tutor-plugins/refs/heads/cq/ulmo.dev/theming/templates/lms/static/images/logo_bandeau.png'
          }
          alt='Logo'
        />
      </div>
      <div class='page-back'>
        <div class='back-icon' onClick={pageBack}>
          <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
            <path d='M12.465 2.24254C12.0975 1.87504 11.505 1.87504 11.1375 2.24254L4.905 8.47504C4.6125 8.76754 4.6125 9.24004 4.905 9.53254L11.1375 15.765C11.505 16.1325 12.0975 16.1325 12.465 15.765C12.8325 15.3975 12.8325 14.805 12.465 14.4375L7.035 9.00004L12.4725 3.56254C12.8325 3.20254 12.8325 2.60254 12.465 2.24254Z' />
          </svg>
        </div>
        <h2 class='page-title'>{pageTitle.split('|')[0].trim()}</h2>
      </div>
    </div>
  </>
);
