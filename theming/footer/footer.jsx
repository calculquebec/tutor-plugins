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

const setCookieFunction = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  let domain_parts = (window.location.hostname + '').split('.');
  domain_parts = domain_parts.shift();
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

        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
	  background-color: #052147;
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
          color: #FFFFFF;
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

	.middle {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  text-align: center;
	  padding: 20px 0;
	  background: #FFFFFF;
	}
	
	.middle a {
	  width: 50%;
	}

	.middle img {
	  max-width: 500px;
	  height: auto;
	  max-height: 80px;
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
	
	.footer {
	    overflow: hidden;
	    margin-top: 0;
	    height: 94px;
	    line-height: 94px;
	    background: #052147;
	    padding: 0 19px;
	    color: #fff;
	}
	.footer .social-nav__link {
	    color: #000;
	}
	.footer .container {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-box-pack: justify;
	    -ms-flex-pack: justify;
	    justify-content: center;
	}
	.footer .container:after {
	    display: none;
	}
	.footer__nav {
	    list-style: none;
	    font-size: 0.875em;
	}
	.footer__list-item {
	    display: inline-block;
	}
	.footer__list-item .footer__link {
	    display: inline-block;
	    height: 24px;
	    line-height: 22px;
	    border-right: 1px solid rgba(255, 255, 255, 0.5);
	}
	.footer__list-item:first-child .footer__link {
	    padding-left: 0;
	}
	.footer__list-item:last-child .footer__link {
	    border-right: 0;
	    padding-right: 0;
	}
	.footer__link {
	    font-weight: 700;
	    padding: 0 19px;
	    text-decoration: none;
	    color: #fff;
	    opacity: 1;
	    -webkit-transition: all 0.25s;
	    transition: all 0.25s;
	}
	.footer__link:hover {
	    color: #fff;
	    opacity: 1;
	}
	.footer__copy {
	    font-weight: 900;
	    opacity: 0.5;
	}
	@media (max-width: 1200px) {
	    .footer .container {
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	    }
	    .footer .container > * {
		text-align: center;
		flex-basis: 100%;
	    }
	    .footer .footer__list-item {
		text-align: center;
		display: block;
		margin: 0;
		line-height: 1em;
		border: none;
	    }
	    .footer .footer__list-item .footer__link {
		border: none;
		padding: 5px;
	    }
	    .footer .footer__copy {
		line-height: 1em;
		margin: 19px 0 38px;
	    }
	    .footer .social-nav {
		margin: 38px 0 19px;
	    }
	    .footer {
		height: auto;
		line-height: 1em;
		margin-top: 0;
	    }
	}

	.post-footer {
	    background: #FFFFFF;
	}
	.post-footer-wrapper {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    text-align: center;
	    padding: 20px 0;
	}
	.post-footer-wrapper a {
	    width: 50%;
	}
	.post-footer-wrapper img {
	    max-width: 500px;
	    height: auto;
	    max-height: 80px;
	}

	@media (max-width: 937px) {
	    .post-footer-wrapper {
		display: block;
	    }
	}

	.social-nav__item,
	.social-nav__link {
	    display: inline-block;
	}
	.social-nav {
	    list-style: none;
	    padding: 0;
	    margin: 0;
	}
	.social-nav__item:first-child .social-nav__link {
	    margin-left: 0;
	}
	.social-nav__item:last-child .social-nav__link {
	    margin-right: 0;
	}
	.social-nav__link {
	    position: relative;
	    text-decoration: none;
	    box-sizing: border-box;
	    margin: 0 5px;
	    color: #fff;
	    vertical-align: middle;
	    border: 2px solid #5b94e1;
	    border-radius: 50%;
	    width: 45px;
	    height: 45px;
	    line-height: 41px;
	    text-align: center;
	    -webkit-transition: 0.25s;
	    transition: 0.25s;
	}
	.social-nav__link .icon {
	    color: #fff;
	}
	.social-nav__link:hover {
	    background-color: #5b94e1;
	    color: #fff;
	}
	.social-nav__descriptor {
	    font-weight: 900;
	    position: absolute;
	    top: 130px;
	    display: none;
	    left: 50%;
	    font-size: 0.588em;
	    transform: translateX(-50%);
	}
	.social-nav__descriptor:before {
	    content: "";
	    height: 65px;
	    width: 1px;
	    right: 50%;
	    position: absolute;
	    background: #fff;
	    bottom: 50px;
	}
	.icon-facebook:before {
	    content: "\f09a";
	}
	.icon-linkedin:before {
	    content: "\f0e1";
	}
    `}
    </style>
    <footer class='footer'>
      <div className='plugins'></div>
      <div class='container'>
	{/*
	<div class="fll">
	  <ul class="social-nav">
	    <li class="social-nav__item">
	      <a href="http://www.facebook.com/calculquebec/" target="_blank" class="social-nav__link">
	        <i class="icon icon-facebook" aria-hidden="true"></i><span class="social-nav__descriptor">Facebook</span>
	      </a>
            </li>
	    <li class="social-nav__item">
              <a href="http://linkedin.com/company/calcul-qu%C3%A9bec" target="_blank" class="social-nav__link">
               <i class="icon icon-linkedin" aria-hidden="true"></i>
               <span class="social-nav__descriptor">LinkedIn</span>
              </a>
            </li>
          </ul>
	</div>*/}
	{/*        <img
          width='321'
          src={
            langIsFrench()
              ? 'https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/logo-fr.png'
              : 'https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/logo-en.png'
          }
          alt='Logo Calcul Québec'
        />*/}
	<ul class="footer__nav fll ul-reset">
	  <li class="footer__list-item">
	    <a href={langIsFrench() ? 'https://docs.alliancecan.ca/wiki/Technical_documentation/fr' : 'https://docs.alliancecan.ca/wiki/Technical_documentation'} target='_blank' class="footer__link">
	      {languages[language].wiki}
	    </a>
	  </li>
	  <li class="footer__list-item">
	    <a href='https://status.alliancecan.ca' target='_blank' class="footer__link">
	      {languages[language].serverstatus}
	    </a>
	  </li>
	  <li class="footer__list-item">
	    <a href={langIsFrench() ? 'https://www.calculquebec.ca/salles-de-presses/infolettres/' : 'https://www.calculquebec.ca/en/pressroom/subscribe-to-our-newsletter/'} target='_blank' class="footer__link">
	      {languages[language].bulletins}
	    </a>
	  </li>
          {/* <li>
            <a href="#">{languages[language].help}</a>
          </li> */}
	  <li class="footer__list-item">
            <a href="mailto:formation@calculquebec.ca" target='_blank' class="footer__link">
              {languages[language].contact}
            </a>
          </li>
	  <li class="footer__list-item">
	    <a href="#" onClick={toggleLanguage} class="footer__link">
	      {languages[language].langswitch}
	    </a>
	  </li>
	  {/*
          <li>
            <a
              href={langIsFrench() ? 'https://www.calculquebec.ca/a-propos/qui-sommes-nous/' : 'https://www.calculquebec.ca/en/about-us/who-are-we/'}
              target='_blank'
            >
              {languages[language].about}
            </a>
          </li> */}
        </ul>
      </div>
    </footer>
    <div class='post-footer'>
      <div class="post-footer-wrapper">
        <a href={langIsFrench() ? 'https://www.alliancecan.ca//fr/' : 'https://www.alliancecan.ca//' } target='_blank'>
          <img src="https://www.calculquebec.ca/wp-content/uploads/2022/04/Alliance_partner_logo_Regional-French-first.svg" alt="Partenaire de l'Alliance" />
        </a>
        <a href="https://www.quebec.ca" target="_blank">
          <img src="https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/logo-quebec.png" alt="Gouvernement du Québec" />
        </a>
        <a href="https://frq.gouv.qc.ca/" target="_blank">
          <img src="https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/fond_de_recherche_du_quebec.png" alt="Fonds de recherche du Québec" />
        </a>
      </div>
    </div>
    <div class='line'></div>
      <div class='bottom'>
        <p class='desktop'>&copy; Calcul Québec 2026</p>
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
        <p class='mobile'>&copy; Calcul Québec 2026</p>
      </div>
  </>
);
