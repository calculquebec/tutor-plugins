import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from tutormfe.hooks import PLUGIN_SLOTS, FRONTEND_SLOTS
from theming.utils import load_file
from tutormfe.hooks import MFE_APPS
from tutor import hooks

hooks.Filters.ENV_PATCHES.add_items([
    ("mfe-site-custom-app-definitions", """
import { WidgetOperationTypes } from '@openedx/frontend-base';
""")
])

def hideMFESlots(slots):
    operations = []
    for mfe_name, slot_name, widgetId in slots:
        operations += [(
            mfe_name, slot_name,
            f"""
            {{
              op: PLUGIN_OPERATIONS.Hide,
              widgetId: 'widgetId',
            }}""")]
    PLUGIN_SLOTS.add_items(operations)

def hideFrontendSlots(slots):
    operations = []
    for slot_name, widgetId in slots:
        operations += [
            f"""
            {{
              slotId: '{slot_name}',
              op: WidgetOperationTypes.REMOVE,
              relatedId: '{widgetId}'
            }}
            """
        ]
    FRONTEND_SLOTS.add_items(operations)

def insertSlots(slots, content, extra = ''):
    mfe_operations = []
    frontend_operations = []
    for mfe_name, slot_name in slots:
        mfe_operations += [(
            mfe_name, slot_name,
            f"""
            {{
              op: PLUGIN_OPERATIONS.Insert,
              widget: {{
                id: 'custom_{slot_name}',
                type: DIRECT_PLUGIN,
                RenderWidget: () => {{
                  {content}
                }},
                {extra}
              }}
            }}"""
            )]
        frontend_operations += [
            f"""
            {{
              slotId: '{slot_name}',
              op: 'widgetAppend',
              id: 'custom_{slot_name}',
              element: (
                {content}
              )
            }}
            """
        ]
    PLUGIN_SLOTS.add_items(mfe_operations)
#    FRONTEND_SLOTS.add_items(frontend_operations)

hideMFESlots([
    ('all', 'desktop_header_slot', 'desktop_header_slot'),
    ('all', 'mobile_header_slot', 'mobile_header_slot'),
    ('all', 'footer_slot', 'default_contents'),
    ('discussions', 'org.openedx.frontend.layout.header_discussions.v1', 'default_contents'),
    ('catalog', 'org.openedx.frontend.catalog.home_page.banner', 'default_contents'),
    ('learning', 'org.openedx.frontend.layout.header_learning_help.v1', 'default_contents'),
    ('learning', 'org.openedx.frontend.learning.unit_title.v1', 'default_contents'),
    ])

hideFrontendSlots([
    ('org.openedx.frontend.slot.header.desktop.v1', 'defaultContent'),
    ('org.openedx.frontend.slot.header.mobile.v1', 'defaultContent'),
    ('org.openedx.frontend.slot.footer.desktop.v1', 'defaultContent')
    ])

insertSlots(
    [('all', 'desktop_header_slot'),
     ('all', 'header_slot'),
     ('discussions', 'org.openedx.frontend.layout.header_discussions.v1'),
    ],
    load_file('header/header.jsx'))

insertSlots([('all', 'mobile_header_slot')], load_file('header/mobileHeader.jsx'))
insertSlots([('all', 'footer_slot')], load_file('footer/footer.jsx'), 'priority: 3,')

# replace home banner in catalog
insertSlots([('catalog', 'org.openedx.frontend.catalog.home_page.banner')], load_file('home_banner/home_banner.jsx'))

slots = []
# logo href
slots += [
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
slots += [
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

PLUGIN_SLOTS.add_items(slots)

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-dockerfile-post-npm-install-authn",
        "RUN npm install '@edx/brand@github:@edly-io/brand-openedx#ulmo/indigo'",
    )
)


# Add hook to insert external CookieYes script
from tutormfe.hooks import EXTERNAL_SCRIPTS
EXTERNAL_SCRIPTS_LOADER = """
class ExternalScriptsLoader {
  externalScripts = {};
  constructor({ config }) {
    this.externalScripts = config['EXTERNAL_SCRIPTS'];
  }

  loadScript() {
    if (!this.externalScripts) {
      return;
    }
    for (var i = 0, keys = Object.keys(this.externalScripts), ii = keys.length; i < ii; i++) {
      const script = document.createElement('script');
      script.id = keys[i];
      script.src = this.externalScripts[keys[i]];
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }
  }
}
"""

hooks.Filters.ENV_PATCHES.add_items([
    ("mfe-env-config-buildtime-definitions", EXTERNAL_SCRIPTS_LOADER),
    ("mfe-site-custom-app-definitions", EXTERNAL_SCRIPTS_LOADER),
])

EXTERNAL_SCRIPTS.add_item(("all", "ExternalScriptsLoader"))

EXTERNAL_STYLESHEETS_LOADER = """
class ExternalStylesheetsLoader {
  externalSheets = {}
  constructor({ config }) {
    this.externalSheets = config['EXTERNAL_STYLESHEETS'];
  }

  loadScript() {
    if (!this.externalSheets) {
      return;
    }
    for (var i = 0, keys = Object.keys(this.externalSheets), ii = keys.length; i < ii; i++) {
      const stylesheet = document.createElement('link');
      stylesheet.id = keys[i];
      stylesheet.rel = 'stylesheet';
      stylesheet.type = 'text/css';
      stylesheet.href = this.externalSheets[keys[i]];
      document.head.appendChild(stylesheet);
    }
  }
}
"""

hooks.Filters.ENV_PATCHES.add_items([
    ("mfe-env-config-buildtime-definitions", EXTERNAL_STYLESHEETS_LOADER),
    ("mfe-site-custom-app-definitions", EXTERNAL_STYLESHEETS_LOADER),
])

EXTERNAL_SCRIPTS.add_item(("all", "ExternalStylesheetsLoader"))

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
