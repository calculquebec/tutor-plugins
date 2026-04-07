import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from tutormfe.hooks import PLUGIN_SLOTS
from theming.utils import load_file

header = [
    (
        "all",
        "desktop_header_slot",
        """
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'desktop_header_slot',
        }"""
    ),
    (
        "all",
        "desktop_header_slot",
        f"""
        {{
          op: PLUGIN_OPERATIONS.Insert,
          widget: {{
            id: 'custom_header',
            type: DIRECT_PLUGIN,
            RenderWidget: () => {{
                {load_file("header/header.jsx")}
            }},
          }},
        }}"""
    )
]

mobile_header = [
    (
        "all",
        "mobile_header_slot",
        """
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'mobile_header_slot',
        }"""
    ),
    (
        "all",
        "mobile_header_slot",
        f"""
        {{
          op: PLUGIN_OPERATIONS.Insert,
          widget: {{
            id: 'custom_mobile_header',
            type: DIRECT_PLUGIN,
            RenderWidget: () => {{
                {load_file("header/mobileHeader.jsx")}
            }},
          }},
        }}"""
    )
]

learning_header = [
    (
        "all",
        "desktop_header_slot",
        """
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'desktop_header_slot',
        }"""
    ),
    (
        "all",
        "header_slot",
        f"""
        {{
          op: PLUGIN_OPERATIONS.Insert,
          widget: {{
            id: 'custom_header',
            type: DIRECT_PLUGIN,
            RenderWidget: () => {{
                {load_file("header/header.jsx")}
            }},
          }},
        }}"""
    )
]

footer = [(
        "all",
        "footer_slot",
        """
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'default_contents',
        }"""
    ),
    (
        "all",
        "footer_slot",
        f"""
        {{
          op: PLUGIN_OPERATIONS.Insert,
          widget: {{
            id: 'custom_footer',
            type: DIRECT_PLUGIN,
            RenderWidget: () => {{
                {load_file("footer/footer.jsx")}
            }},
            priority: 3,
          }},
        }}"""
    )
]

home_banner = [
    (
        "catalog",
        "org.openedx.frontend.catalog.home_page.banner",
        """
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'default_contents',
        }"""
    ),
    (
        "catalog",
        "org.openedx.frontend.catalog.home_page.banner",
        f"""
        {{
          op: PLUGIN_OPERATIONS.Insert,
          widget: {{
            id: 'custom_home_banner',
            type: DIRECT_PLUGIN,
            RenderWidget: () => {{
                {load_file("home_banner/home_banner.jsx")}
            }},
          }},
        }}"""
    )
]

logo_href = [
    (
        "all",
        "org.openedx.frontend.layout.header_logo.v1",
        """
        {
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'default_contents',
          fn: modifyLogoHref,
        }
        """
    ),
]

help_slot = [
    (
        "learning",
        "org.openedx.frontend.layout.header_learning_help.v1",
        """
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'default_contents',
        }"""
    )
]

unit_title_slot = [
    (
        "learning",
        "org.openedx.frontend.learning.unit_title.v1",
        """
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'default_contents',
        }"""
    ),
    (
        "learning",
        "org.openedx.frontend.learning.unit_title.v1",
        """
        {
          // Insert custom content after unit title
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_unit_title_content',
            type: DIRECT_PLUGIN,
            RenderWidget: ({ unitId, unit, renderUnitNavigation }) => (
              <>
                <div class="d-flex justify-content-between">
                <div class="mb-0">
                <h2 class="h2">{unit.title}</h2>
                </div>
                {renderUnitNavigation(true)}
                </div>
              </>
            ),
          },
        }
        """
    )
]

menu_items = [
    (
        "all",
        "org.openedx.frontend.layout.header_desktop_secondary_menu.v1",
        """
        {
          // Modify content
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'default_contents',
          fn: addAproposToMenu,
        }
        """
    ),
    (
        "all",
        "org.openedx.frontend.layout.header_desktop_main_menu.v1",
        """
        {
          // Modify content
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'default_contents',
          fn: addAproposToMenu,
        }
        """
    ),
    (
        "all",
        "org.openedx.frontend.layout.header_mobile_main_menu.v1",
        """
        {
          // Modify content
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'default_contents',
          fn: addAproposToMenu,
        }
        """
    ),
    (
        "catalog",
        "org.openedx.frontend.layout.header_learning_logged_out_items.v1",
        """
        {
          // modify content
          op: plugin_operations.modify,
          widgetid: 'default_contents',
          fn: addapropostomenu,
        }
        """
    ),
    (
        "catalog",
        "org.openedx.frontend.layout.header_mobile_logged_out_items.v1",
        """
        {
          // modify content
          op: plugin_operations.modify,
          widgetid: 'default_contents',
          fn: addapropostomenu,
        }
        """
    ),
]
#comment to trigger a rebuild

PLUGIN_SLOTS.add_items(
    header + mobile_header + learning_header + footer + home_banner + logo_href + help_slot + unit_title_slot + menu_items
)

from tutormfe.hooks import MFE_APPS
from tutor import hooks
hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-dockerfile-post-npm-install-authn",
        "RUN npm install '@edx/brand@github:@edly-io/brand-openedx#ulmo/indigo'",
    )
)

@MFE_APPS.add()
def _add_my_mfe(mfes):
    mfe_version = "cq/ulmo.dev"
    mfes["authn"]["repository"] = "https://github.com/calculquebec/frontend-app-authn.git"  # your public/private repo link
    mfes["authn"]["version"] = mfe_version
    mfes["account"]["repository"] = "https://github.com/calculquebec/frontend-app-account.git"  # your public/private repo link
    mfes["account"]["version"] = mfe_version
    mfes["catalog"] = {}
    mfes["catalog"]["repository"] = "https://github.com/calculquebec/frontend-app-catalog.git"  # your public/private repo link
    mfes["catalog"]["version"] = mfe_version
    mfes["catalog"]["port"] = 1998
    mfes["discussions"]["repository"] = "https://github.com/calculquebec/frontend-app-discussions.git"  # your public/private repo link
    mfes["discussions"]["version"] = mfe_version
    mfes["learner-dashboard"]["repository"] = "https://github.com/calculquebec/frontend-app-learner-dashboard.git"  # your public/private repo link
    mfes["learner-dashboard"]["version"] = mfe_version
    mfes["learning"]["repository"] = "https://github.com/calculquebec/frontend-app-learning.git"  # your public/private repo link
    mfes["learning"]["version"] = mfe_version
    mfes["profile"]["repository"] = "https://github.com/calculquebec/frontend-app-profile.git"  # your public/private repo link
    mfes["profile"]["version"] = mfe_version
    return mfes

#@MFE_APPS.add()
#def _add_catalog_mfe(mfes):
#    mfes["catalog"] = {
#        "repository": "https://github.com/openedx/frontend-app-catalog.git",
#        "port": 1998,
#        "version": "master", # optional, will default to the Open edX current tag.
#    }

catalog_mfe_url = """
CATALOG_MICROFRONTEND_URL = "https://{{ MFE_HOST }}/catalog"
"""

env_items = [
    (
        "openedx-common-settings",
        catalog_mfe_url,
    ),
#    (
#        "openedx-common-settings",
#"""FEATURES["ENABLE_FEEDBACK_INSTRUCTOR_VIEW"] = True
#OPEN_EDX_FILTERS_CONFIG = {
#    "org.openedx.learning.instructor.dashboard.render.started.v1": {
#        "fail_silently": False,
#        "pipeline": [
#            "feedback.extensions.filters.AddFeedbackTab",
#        ]
#    },
#}"""
#    ),
    (
        "openedx-lms-common-settings",
        "ENABLE_CATALOG_MICROFRONTEND = True",
    ),
    (
        "mfe-env-config-buildtime-definitions",
        """
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
const modifyLogoHref = ( widget ) => {
  widget.content.href = '/';
  return widget;
};
const addAproposToMenu = ( widget ) => {
  const language = getLanguage();
  const existingMenu = widget.RenderWidget.props.menu || [];

  const newMenuItems = {
    'fr-ca': [
    {
      type: 'item',
      href: 'https://www.calculquebec.ca/a-propos/qui-sommes-nous/',
      content: 'À propos',
    },
    ],
    'en': [
    {
      type: 'item',
      href: 'https://www.calculquebec.ca/en/about-us/who-are-we/',
      content: 'About',
    },
    ],
  };
  const menuItems = newMenuItems[language];
  widget.content.menu = [...existingMenu, ...menuItems];
  return widget;
};
"""
    )
]

for item in env_items:
    hooks.Filters.ENV_PATCHES.add_item(item)

