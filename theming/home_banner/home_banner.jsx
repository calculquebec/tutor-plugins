const getLanguage = () => {
  const languageCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("openedx-language-preference="));

  const languageFromCookie = languageCookie
    ? languageCookie.split("=")[1]
    : "fr-ca";

  if (languageFromCookie === "fr" || languageFromCookie === "fr-ca") {
    return "fr-ca";
  } else {
    return "en";
  }
};

const language = getLanguage();

const langIsFrench = () => {
  return language === "fr-ca" || language === "fr";
};

const languages = {
  "fr-ca": {
    bannertext: "Bienvenue sur evolo, la plateforme de formation de Calcul Québec.",
  },
  en: {
    bannertext: "Welcome to evolo, Calcul Québec's learning platform.",
  },
}
return (
  <>
    <script src='https://kit.fontawesome.com/91003a351d.js' crossorigin='anonymous'></script>
    <style>
      {`
        .home-banner {
	  display: block;
	  background-color: #ffffff;
	}
    `}
    </style>
    <div class="home-banner">
      {languages[language].bannertext}
    </div>
  </>
);
