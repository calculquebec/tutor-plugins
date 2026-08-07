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
          <img src="https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/logo-quebec-v2.png" alt="Gouvernement du Québec" />
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
