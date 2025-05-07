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
    help: "Aide",
    contact: "Nous contacter",
    about: "À propos",
    terms: "Conditions d'utilisation",
    policies: "Politiques et publications",
    poweredBy: "Propulsé par",
  },
  en: {
    help: "Help",
    contact: "Contact us",
    about: "About",
    terms: "Terms of use",
    policies: "Policies and publications",
    poweredBy: "Powered by",
  },
};

return (
  <>
    <script src='https://kit.fontawesome.com/91003a351d.js' crossorigin='anonymous'></script>
    <style>
      {`
        .wrapper-footer {
          display: none !important;
        }

        .footer {
          background: white;
          color: #052147;
          padding: 32px 16px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .top-links {
          display: flex;
          flex-direction: row;
          gap: 40px;
          margin-right: 50px;
          margin-top: 0;
        }

        .top-links li,
        .bottom-links li,
        .logo-list li {
          list-style: none;
        }

        .top-links a {
          text-decoration: none;
          color: #052147;
          font-size: 14px;
          font-weight: 500;
        }

        .top-links a:hover,
        .bottom-links a:hover {
          text-decoration: underline;
        }

        .line {
          width: 100%;
          height: 1px;
          background-color: #013d5b;
          opacity: 0.16;
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          font-size: 12px;
          font-weight: 400;
        }

        .bottom-links {
          display: flex;
          flex-direction: row;
          gap: 40px;
          height: 100%;
        }

        .bottom-links a {
          text-decoration: none;
          color: #052147;
        }

        .logo-list {
          display: flex;
          flex-direction: row;
          gap: 8px;
          align-items: center;
        }

        .logo-list .powered {
          transform: translateY(-2px);
        }

        .logo-list .vertical-line {
          width: 1px;
          height: 12px;
          background-color: #052147;
          opacity: 0.8;
          transform: translateY(-2px);
          }

        .logo-list .openedx {
          margin-left: -16px;
        }

        .mobile {
          display: none;
        }

        @media (max-width: 1000px) {
          .top {
              flex-direction: column;
              align-items: center;
          }

          .top-links {
              margin: 16px 0 0;
              padding: 0;
          }

          .bottom {
              flex-direction: column;
              align-items: center;
              text-align: center;
          }

          .mobile {
              display: block;
          }

          .desktop {
              display: none;
          }
        }

        body.indigo-dark-theme .top img {
          filter: brightness(0) invert(1);
          background-color: transparent !important;
        }

        body.indigo-dark-theme a {
          color: white !important;
        }

        body.indigo-dark-theme .footer a:hover{
          text-decoration: underline !important;
          color: #6095C1 !important;
        }

        body.indigo-dark-theme .footer .line, body.indigo-dark-theme .footer .vertical-line {
          background-color: #fff !important;
        }
    `}
    </style>
    <footer class='footer'>
      <div class='top'>
        <img
          width='321'
          src={
            langIsFrench()
              ? 'https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/logo-fr.png'
              : 'https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/logo-en.png'
          }
          alt='Logo Calcul Québec'
        />
        <ul class='top-links'>
          {/* <li>
            <a href="#">{languages[language].help}</a>
          </li> */}
          <li>
            <a href={langIsFrench() ? 'https://www.calculquebec.ca/contact/' : 'https://www.calculquebec.ca/en/contact/'} target='_blank'>
              {languages[language].contact}
            </a>
          </li>
          <li>
            <a
              href={langIsFrench() ? 'https://www.calculquebec.ca/a-propos/qui-sommes-nous/' : 'https://www.calculquebec.ca/en/about-us/who-are-we/'}
              target='_blank'
            >
              {languages[language].about}
            </a>
          </li>
        </ul>
      </div>
      <div class='line'></div>
      <div class='bottom'>
        <p class='desktop'>&copy; Calcul Québec 2025</p>
        <ul class='bottom-links'>
          <li>
            <a
              href={
                langIsFrench()
                  ? 'https://www.calculquebec.ca/wp-content/uploads/2024/08/conditions-utilisation.pdf'
                  : 'https://www.calculquebec.ca/wp-content/uploads/2024/08/terms-of-use.pdf'
              }
              target='_blank'
            >
              {languages[language].terms}
            </a>
          </li>
          <li>
            <a
              href={
                langIsFrench()
                  ? 'https://www.calculquebec.ca/a-propos/politiques-et-publications/'
                  : 'https://www.calculquebec.ca/en/about-us/policies-and-publications/'
              }
              target='_blank'
            >
              {languages[language].policies}
            </a>
          </li>
        </ul>
        <ul class='logo-list'>
          <li class='powered'>{languages[language].poweredBy}</li>
          <li>
            <a href='https://docs.tutor.edly.io' rel='noopener' target='_blank'>
              <img
                src='https://repository-images.githubusercontent.com/96100263/4f41d9c4-98d1-4934-a681-47b4f0917f78'
                alt='Runs on Tutor'
                width='57'
              />
            </a>
          </li>
          <li class='vertical-line'></li>
          <li class='openedx'>
            <a href='https://openedx.org/' rel='noopener' target='_blank'>
              <img src='https://logos.openedx.org/edx-openedx-logo-tag.png' alt={languages[language].poweredBy + ' Open edX'} width='110' />
            </a>
          </li>
        </ul>
        <p class='mobile'>&copy; Calcul Québec 2025</p>
      </div>
    </footer>
  </>
);
