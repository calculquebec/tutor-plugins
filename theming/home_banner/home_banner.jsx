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

const languages = {
  "fr-ca": {
    bannerwelcome: "Bienvenue sur evolo",
    bannerplatform: "La plateforme de formation gratuite de Calcul Québec destinée à la communauté de la recherche.",
    bannercomeback: "Revenez régulièrement : de nouveaux cours sont en préparation !",
  },
  en: {
    bannerwelcome: "Welcome to evolo",
    bannerplatform: "Calcul Québec's free learning platform aimed at the research community.",
    bannercomeback: "Come back often: new content is being prepared!",
  },
}
return (
  <>
    <script src='https://kit.fontawesome.com/91003a351d.js' crossorigin='anonymous'></script>
    <style>
      {`
        .cq-banner {
	  display: block;
	  background-color: #E4E9EB;
	  color: #000000;
	  text-align: center;
	  padding: 1.2em;
	  font-size: 1.0em;
	}

	@media (max-width: 937px) {
	  .cq-banner {
	    display: none;
	  }
	}
	
	.cq-title {
	  font-size: 1.5em;
	}
    `}
    </style>
    <div class="cq-banner">
      <div class="cq-title">
      {languages[language].bannerwelcome}
      </div><br/>
      {languages[language].bannerplatform} <br/>
      {languages[language].bannercomeback} <br/>
    </div>
  </>
);
