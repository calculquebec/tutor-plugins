const getLanguage = () => {
  const languageCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('openedx-language-preference='));

  const languageFromCookie = languageCookie ? languageCookie.split('=')[1] : 'fr-ca';

  if (languageFromCookie === 'fr' || languageFromCookie === 'fr-ca') {
    return 'fr-ca';
  } else {
    return 'en';
  }
};

const language = getLanguage();

const pageTitle = document.title;

const langIsFrench = () => {
  return language === 'fr-ca' || language === 'fr';
};

const pageBack = () => {
  window.history.back();
};

return (
  <>
    <script src='https://kit.fontawesome.com/91003a351d.js' crossorigin='anonymous'></script>
    <style>
      {`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

        :root {
          /* Primary colors */
          --primary-blue: #72aee0;
          --secondary-blue: #013d5b;
          --dark-blue: #052147;
          --pale-grey: #f7f7f7f7;

          /* Overlay colors */
          --banner-overlay: rgba(10, 45, 93, 0.7);
          --dark-mode-overlay: rgba(255, 255, 255, 0.1);

          /* Text colors */
          --text-light: #ffffff;
          --text-dark: #052147;

          /* State colors */
          --hover-border-color: var(--dark-blue);
          --active-link-color: var(--primary-blue);
        }

        * {
          font-family: "Roboto", sans-serif !important;
          font-optical-sizing: auto;
        }

        #root header.site-h</svg>eader-desktop .logo img,
        body.indigo-dark-theme #root header.site-header-desktop .logo img {
          height: 30px;
        }

        #root header.site-header-desktop .main-nav a.nav-link.active {
          color: var(--active-link-color) !important;
          border-bottom: 2px solid var(--active-link-color) !important;
        }

        #root header.site-header-desktop .main-nav a.nav-link:hover {
          border-bottom: 2px solid var(--hover-border-color);
        }

        .masquerade-bar {
          justify-content: center;
        }

        .banner {
          background: url("https://raw.githubusercontent.com/calculquebec/tutor-plugins/refs/heads/cq/ulmo.dev/theming/templates/lms/static/images/image_bandeau.png")
            no-repeat center 40% !important;
          background-size: cover !important;
          height: 170px;
          position: relative;
        }

        .banner .cover-filter {
          background-size: cover;
          height: 170px;
        }

        .banner img {
          max-width: 527px;
          max-height: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .page-title {
          font-size: 30px;
          color: var(--dark-blue);
          font-weight: 400;
          line-height: 30px;
          margin: 0;
        }

        .page-back {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 24px 48px;
        }

        .back-icon {
          display: none;
          padding: 8px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          border: 2px solid var(--primary-blue);
        }

        .back-icon svg path {
          fill: var(--primary-blue);
        }

        .back-icon:hover {
          background-color: var(--primary-blue);
        }

        .back-icon:hover svg,
        .back-icon:hover svg path {
          fill: var(--text-light);
        }

        body.indigo-dark-theme #root,
        body.indigo-dark-theme main,
        body.indigo-dark-theme .page-back,
        body.indigo-dark-theme .footer,
        body.indigo-dark-theme #no-courses-content-view,
        body.indigo-dark-theme .pgn__card {
          background-color: var(--dark-blue) !important;
          background: var(--dark-blue) !important;
          color: var(--text-light);
        }

        body.indigo-dark-theme #root header.site-header-desktop {
          background-color: var(--dark-blue) !important;
          box-shadow: 0 1px 2px 0 #0000000f, 0 1px 3px 0 #0000001a;
        }

        body.indigo-dark-theme .banner img {
          background-color: transparent !important;
        }

        body.indigo-dark-theme #root header.site-header-desktop .menu button {
          background-color: var(--primary-blue) !important;
        }

        body.indigo-dark-theme #root header.site-header-desktop .menu .menu-content a {
          background-color: var(--dark-blue) !important;
          color: var(--text-light) !important;
        }

        body.indigo-dark-theme #root header.site-header-desktop .menu .menu-content {
          background-color: var(--dark-blue) !important;
          box-shadow: none !important;
        }

        body.indigo-dark-theme .text-muted:not(svg),
        body.indigo-dark-theme .page__account-settings .row .col-md-2 .jump-nav ul li a:hover,
        body.indigo-dark-theme #root header.site-header-desktop .menu .menu-content a:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        body.indigo-dark-theme .dropdown-divider {
          border-color: var(--light-grey, #F7F7F7) !important;
          opacity: 0.2;
        }

        .theme-toggle-button {
          display: none;
          gap: 0.5rem;
        }

        .theme-toggle-button .toggle-switch .switch .slider {
          background-color: var(--primary-blue) !important;
        }

        body.indigo-dark-theme
          .theme-toggle-button
          .toggle-switch
          .switch
          .slider:before {
          background-color: var(--dark-blue) !important;
        }

        .pgn-transition-replace-group,
        .form-group {
          border-color: var(--primary-blue) !important;
        }

        body.indigo-dark-theme
          .page__account-settings
          .pgn-transition-replace-group
          .form-group
          .d-flex.align-items-start
          button,
        body.indigo-dark-theme
          .page__account-settings
          .pgn-transition-replace-group
          form
          > p
          button {
            background-color: var(--primary-blue) !important;
            color: var(--dark-blue) !important;
            border-color: var(--primary-blue) !important;
        }

        body.indigo-dark-theme
          .page__account-settings
          .pgn-transition-replace-group
          .form-group
          .d-flex.align-items-start
          button:hover,
        body.indigo-dark-theme
          .page__account-settings
          .pgn-transition-replace-group
          form
          > p
          button:hover {
            border-color: var(--dark-blue) !important;
        }

        body.indigo-dark-theme
          .page__account-settings
          .pgn-transition-replace-group
          form
          > p
          button.btn-outline-primary {
            color: var(--primary-blue) !important;
            border-color: var(--primary-blue) !important;
        }

        .raised-card .rounded-bottom, .raised-card .pgn__data-table-footer {
          background-color: var(--primary-blue) !important;
          border-radius: 0 0 8px 0 !important;  
        }

        #weighted-grade-summary, text {
          color: white !important;
        }

        body.indigo-dark-theme .course-card-banners > div:first-of-type, body.indigo-dark-theme div[data-testid=instructor-toolbar] .bg-primary, body.indigo-dark-theme .bg-primary, body.indigo-dark-theme .course-tabs-navigation+.container-xl>.row>.col-12.col-md-4.p-0.px-md-4 section.mb-4.x-small {
          background-color: var(--dark-blue) !important;
        }

        body.indigo-dark-theme .course-tabs-navigation+.container-xl .donut-ring.incomplete-stroke {
          background-color: var(--dark-mode-overlay) !important;
        }

        body.indigo-dark-theme * {
          accent-color: var(--primary-blue) !important;
        }

	/* issue https://github.com/calculquebec/edx/issues/56 */
	section.course-info.about.container {
	  padding-top: 25px !important;
	}

      `}
    </style>
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
