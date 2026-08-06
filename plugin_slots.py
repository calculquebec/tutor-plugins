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
#comment to trigger a rebuild

PLUGIN_SLOTS.add_items(
    header + mobile_header + learning_header + footer + home_banner + logo_href + help_slot + unit_title_slot
)

from tutormfe.hooks import MFE_APPS
from tutor import hooks
hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-dockerfile-post-npm-install-authn",
        "RUN npm install '@edx/brand@github:@edly-io/brand-openedx#ulmo/indigo'",
    )
)


# Add hook to insert external CookieYes script
from tutormfe.hooks import EXTERNAL_SCRIPTS
EXTERNAL_SCRIPTS_LOADER_TSX = """
export interface ExternalScriptsConfig {
  EXTERNAL_SCRIPTS?: Record<string, string>;
  [key: string]: unknown;
}

export interface ExternalScriptsLoaderOptions {
  config: ExternalScriptsConfig;
}

declare global {
  interface Window {
    ckySettings?: {
      documentLang: string | null;
    };
  }
}

export class ExternalScriptsLoader {
  private config: ExternalScriptsConfig;

  constructor({ config }: ExternalScriptsLoaderOptions) {
    this.config = config;
  }

  public loadScript(): void {
    const externalScripts = this.config['EXTERNAL_SCRIPTS'];
    if (!externalScripts) {
      return;
    }

    const keys = Object.keys(externalScripts);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const script = document.createElement('script');
      script.id = key;
      script.src = externalScripts[key];
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }

    const scriptLang = document.createElement('script');
    scriptLang.defer = true;
    scriptLang.id = 'cookieyes_lang';
    scriptLang.type = 'text/javascript';
    scriptLang.innerHTML =
      "const languageCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('openedx-language-preference=')); const browserLang = navigator.languages?.[0] || navigator.language || null; const language = languageCookie ? decodeURIComponent(languageCookie.split('=')[1]) : browserLang; window.ckySettings = {documentLang: language};";
    document.head.appendChild(scriptLang);
  }
}
"""
EXTERNAL_SCRIPTS_LOADER_JSX = """
class ExternalScriptsLoader {
  constructor({ config }) {
    this.config = config;
  }

  loadScript() {
    if (!this.config['EXTERNAL_SCRIPTS']) {
      return;
    }
    for (var i = 0, keys = Object.keys(this.config['EXTERNAL_SCRIPTS']), ii = keys.length; i < ii; i++) {
      const script = document.createElement('script');
      script.id = keys[i];
      script.src = this.config['EXTERNAL_SCRIPTS'][keys[i]];
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }

    const script_lang = document.createElement('script');
    script_lang.id = 'cookieyes_lang';
    script_lang.type = 'text/javascript';
    script_lang.innerHTML = "const languageCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('openedx-language-preference=')); const browserLang = navigator.languages?.[0] || navigator.language || null; const language = languageCookie ? decodeURIComponent(languageCookie.split('=')[1]) : browserLang; window.ckySettings = {documentLang: language};";
    document.head.appendChild(script_lang);
  }
}
"""

hooks.Filters.ENV_PATCHES.add_items([
    ("mfe-env-config-buildtime-definitions", EXTERNAL_SCRIPTS_LOADER_JSX),
    ("mfe-site-custom-app-definitions", EXTERNAL_SCRIPTS_LOADER_TSX),
])

EXTERNAL_SCRIPTS.add_item(("all", "ExternalScriptsLoader"))

@MFE_APPS.add()
def _add_my_mfe(mfes):
    mfe_version = "cq/verawood.dev"
    mfes["authn"]["repository"] = "https://github.com/calculquebec/frontend-app-authn.git"  # your public/private repo link
    mfes["authn"]["version"] = mfe_version
    mfes["account"]["repository"] = "https://github.com/calculquebec/frontend-app-account.git"  # your public/private repo link
    mfes["account"]["version"] = mfe_version
#    mfes["catalog"] = {}
#    mfes["catalog"]["repository"] = "https://github.com/calculquebec/frontend-app-catalog.git"  # your public/private repo link
#    mfes["catalog"]["version"] = mfe_version
#    mfes["catalog"]["port"] = 1998
#    mfes["discussions"]["repository"] = "https://github.com/calculquebec/frontend-app-discussions.git"  # your public/private repo link
#    mfes["discussions"]["version"] = mfe_version
#    mfes["learner-dashboard"]["repository"] = "https://github.com/calculquebec/frontend-app-learner-dashboard.git"  # your public/private repo link
#    mfes["learner-dashboard"]["version"] = mfe_version
#    mfes["learning"]["repository"] = "https://github.com/calculquebec/frontend-app-learning.git"  # your public/private repo link
#    mfes["learning"]["version"] = mfe_version
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

env_items = [
    (
        "openedx-common-settings",
"""FEATURES["ENABLE_FEEDBACK_INSTRUCTOR_VIEW"] = True
OPEN_EDX_FILTERS_CONFIG = {
    "org.openedx.learning.instructor.dashboard.render.started.v1": {
        "fail_silently": False,
        "pipeline": [
            "feedback.extensions.filters.AddFeedbackTab",
        ]
    },
}"""
    ),
    (
        "mfe-env-config-buildtime-definitions",
        """
const modifyLogoHref = ( widget ) => {
  widget.content.href = '/';
  return widget;
};"""
    )
]

for item in env_items:
    hooks.Filters.ENV_PATCHES.add_item(item)

