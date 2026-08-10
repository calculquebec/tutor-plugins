import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from tutormfe.hooks import PLUGIN_SLOTS, FRONTEND_SLOTS, MFE_APPS, FRONTEND_APPS, EXTERNAL_SCRIPTS
from theming.utils import load_file
from tutor import hooks

@FRONTEND_APPS.add()
def _enable_core_apps(apps):
#    apps["authn"]["enabled"] = True
    apps["learner-dashboard"]["enabled"] = True
    return apps

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

hooks.Filters.ENV_PATCHES.add_items([
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
    ("mfe-dockerfile-post-npm-install-authn", "RUN npm install '@edx/brand@github:@edly-io/brand-openedx#ulmo/indigo'"),
    # for Frontend base apps
    ("mfe-site-custom-app-definitions", """
import { WidgetOperationTypes } from '@openedx/frontend-base';
"""),
    ("mfe-site-custom-app-definitions", load_file('calculquebec.tsx')),
    ("mfe-site-custom-app-definitions", load_file('external_loaders.tsx')),
    # for MFEs
    ("mfe-env-config-buildtime-definitions", """
const modifyLogoHref = ( widget ) => {
  widget.content.href = '/';
  return widget;
};
"""),
    ("mfe-env-config-buildtime-definitions", load_file('calculquebec.tsx')),
    ("mfe-env-config-buildtime-definitions", load_file('external_loaders.tsx')),
])

# Add hook to insert external CookieYes script
EXTERNAL_SCRIPTS.add_items([
    ("all", "ExternalScriptsLoader"),
    ("all", "ExternalStylesheetsLoader"),
])



def hideMFESlots(slots):
    operations = []
    for mfe_name, slot_name, widgetId in slots:
        operations += [(
            mfe_name, slot_name,
            f"""
            {{
              op: PLUGIN_OPERATIONS.Hide,
              widgetId: '{widgetId}',
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

def insertMFESlots(slots, content, extra = ''):
    operations = []
    for mfe_name, slot_name in slots:
        operations += [(
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
    PLUGIN_SLOTS.add_items(operations)

def insertFrontendSlots(slots, content, extra = ''):
    operations = []
    for slot_name in slots:
        operations += [
            f"""
            {{
              slotId: '{slot_name}',
              op: WidgetOperationTypes.APPEND,
              id: 'custom_{slot_name}',
              element: (
                {content}
              )
            }}
            """
        ]
    FRONTEND_SLOTS.add_items(operations)

hideMFESlots([
    ('all', 'desktop_header_slot', 'desktop_header_slot'),
    ('all', 'mobile_header_slot', 'mobile_header_slot'),
    ('all', 'footer_slot', 'default_contents'),
    ('discussions', 'org.openedx.frontend.layout.header_discussions.v1', 'default_contents'),
    ('catalog', 'org.openedx.frontend.catalog.home_page.banner', 'default_contents'),
    ('all', 'org.openedx.frontend.layout.header_learning_help.v1', 'default_contents'),
    ('learning', 'org.openedx.frontend.learning.unit_title.v1', 'default_contents'),
    ])

hideFrontendSlots([
    ('org.openedx.frontend.slot.header.desktop.v1', 'defaultContent'),
    ('org.openedx.frontend.slot.header.mobile.v1', 'defaultContent'),
    ('org.openedx.frontend.slot.footer.desktop.v1', 'org.openedx.frontend.widget.footer.desktopLayout.v1'),
    ('org.openedx.frontend.slot.header.secondaryLinks.v1', 'org.openedx.frontend.widget.header.help.v1'),
    ])

def wrapTSXLiteral(code):
    return f"""
return (
{code}
);
"""

insertMFESlots(
    [('all', 'desktop_header_slot'),
     ('all', 'header_slot'),
     ('discussions', 'org.openedx.frontend.layout.header_discussions.v1'),
    ],
    wrapTSXLiteral(load_file('header.tsx')))

insertMFESlots([('all', 'mobile_header_slot')], wrapTSXLiteral(load_file('header.tsx')))
insertMFESlots([('all', 'footer_slot')], wrapTSXLiteral(load_file('footer.tsx')), 'priority: 3,')

insertFrontendSlots([('org.openedx.frontend.slot.header.desktop.v1')], load_file('header.tsx'))
insertFrontendSlots([('org.openedx.frontend.slot.footer.desktop.v1')], load_file('footer.tsx'))

# replace home banner in catalog
insertMFESlots([('catalog', 'org.openedx.frontend.catalog.home_page.banner')], wrapTSXLiteral(load_file('home_banner.tsx')))

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
