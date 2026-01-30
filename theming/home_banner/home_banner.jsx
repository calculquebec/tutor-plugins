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
    bannerwelcome: "Bienvenue sur evolo, la plateforme de formation de Calcul Québec.",
    bannercourses: "Vous trouverez ci-dessous les cours que nous proposons.",
    bannerconnect1: "Pour débuter, cliquez sur le lien",
    bannerocnnect2: "Se connecter, en haut à droite de cette page, puis sur",
    bannercilogon1: "IMPORTANT: Vous devez ensuite sélectionner",
    bannercilogon2: "établissement académique et vous connecter avec les identifiants de votre établissement.",
    login: "Se connecter",
    your: "votre",
  },
  en: {
    bannerwelcome: "Welcome to evolo, Calcul Québec's learning platform.",
    bannercourses: "Here are the classes that you can follow.",
    bannerconnect1: "To start, click on",
    bannerconnect2: ", at the top right of this page, then on",
    bannercilogon1: "IMPORTANT: You must then select",
    bannercilogon2: "academic institution in the list, and connect through the credentials of your institution.",
    login: "Login",
    your: "you",
  },
}
return (
  <>
    <script src='https://kit.fontawesome.com/91003a351d.js' crossorigin='anonymous'></script>
    <style>
      {`
        .cq-banner {
	  display: block;
	  background-color: #eeeeee;
	  text-align: center;
	  padding: 2em;
	  border-top: 1px solid black;
	  border-bottom: 1px solid black;
	  font-size: 1em;
	}
    `}
    </style>
    <div class="cq-banner">
      {languages[language].bannerwelcome} <br/>
      {languages[language].bannercourses} <br/>
      {languages[language].bannerconnect1} <i>{languages[language].login}</i> {languages[language].bannerconnect2} <i>CILogon.</i><br/>
      {languages[language].bannercilogon1} <b><u>{languages[language].your}</u></b> {languages[language].bannercilogon2}<br/>
    </div>
  </>
);
