  <>
    <script src="https://kit.fontawesome.com/91003a351d.js" crossOrigin="anonymous"></script>
    <footer className="footer">
      <div className="plugins"></div>
      <div className="container">
        <ul className="footer__nav fll ul-reset">
          <li className="footer__list-item">
            <a
              href={
                langIsFrench()
                  ? 'https://docs.alliancecan.ca/wiki/Technical_documentation/fr'
                  : 'https://docs.alliancecan.ca/wiki/Technical_documentation'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              {languages[language].wiki}
            </a>
          </li>
          <li className="footer__list-item">
            <a href="https://status.alliancecan.ca" target="_blank" rel="noopener noreferrer" className="footer__link">
              {languages[language].serverstatus}
            </a>
          </li>
          <li className="footer__list-item">
            <a
              href={
                langIsFrench()
                  ? 'https://www.calculquebec.ca/salles-de-presses/infolettres/'
                  : 'https://www.calculquebec.ca/en/pressroom/subscribe-to-our-newsletter/'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              {languages[language].bulletins}
            </a>
          </li>
          <li className="footer__list-item">
            <a href="mailto:formation@calculquebec.ca" target="_blank" rel="noopener noreferrer" className="footer__link">
              {languages[language].contact}
            </a>
          </li>
          <li className="footer__list-item">
            <a
              href="#"
              onClick={toggleLanguage}
              className="footer__link"
            >
              {languages[language].langswitch}
            </a>
          </li>
        </ul>
      </div>
    </footer>
    <div className="post-footer">
      <div className="post-footer-wrapper">
        <a href={langIsFrench() ? 'https://www.alliancecan.ca//fr/' : 'https://www.alliancecan.ca//'} target="_blank" rel="noopener noreferrer">
          <img src="https://www.calculquebec.ca/wp-content/uploads/2022/04/Alliance_partner_logo_Regional-French-first.svg" alt="Partenaire de l'Alliance" />
        </a>
        <a href="https://www.quebec.ca" target="_blank" rel="noopener noreferrer">
          <img src="https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/logo-quebec-v2.png" alt="Gouvernement du Québec" />
        </a>
        <a href="https://frq.gouv.qc.ca/" target="_blank" rel="noopener noreferrer">
          <img src="https://www.calculquebec.ca/wp-content/themes/calcul_quebec/assets/img/fond_de_recherche_du_quebec.png" alt="Fonds de recherche du Québec" />
        </a>
      </div>
    </div>
    <div className="line"></div>
    <div className="bottom">
      <p className="desktop">&copy; Calcul Québec 2026</p>
      <ul className="bottom-links">
        <li>
          <a
            href={
              langIsFrench()
                ? 'https://www.calculquebec.ca/wp-content/uploads/2024/08/conditions-utilisation.pdf'
                : 'https://www.calculquebec.ca/wp-content/uploads/2024/08/terms-of-use.pdf'
            }
            target="_blank"
            rel="noopener noreferrer"
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
            target="_blank"
            rel="noopener noreferrer"
          >
            {languages[language].policies}
          </a>
        </li>
      </ul>
      <ul className="logo-list">
        <li className="powered">{languages[language].poweredBy}</li>
        <li>
          <a href="https://docs.tutor.edly.io" rel="noopener noreferrer" target="_blank">
            <img
              src="https://repository-images.githubusercontent.com/96100263/4f41d9c4-98d1-4934-a681-47b4f0917f78"
              alt="Runs on Tutor"
              width="57"
            />
          </a>
        </li>
        <li className="vertical-line"></li>
        <li className="openedx">
          <a href="https://openedx.org/" rel="noopener noreferrer" target="_blank">
            <img src="https://logos.openedx.org/edx-openedx-logo-tag.png" alt={languages[language].poweredBy + ' Open edX'} width="110" />
          </a>
        </li>
      </ul>
      <p className="mobile">&copy; Calcul Québec 2026</p>
    </div>
  </>