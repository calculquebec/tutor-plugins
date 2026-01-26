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
          }},
        }}"""
    )
]
#comment to trigger a rebuild

PLUGIN_SLOTS.add_items(
    header + mobile_header + learning_header + footer
)

from tutormfe.hooks import MFE_APPS
from tutor import hooks

@MFE_APPS.add()
def _add_my_mfe(mfes):
    mfe_version = "cq/ulmo.dev"
    mfes["authn"]["repository"] = "https://github.com/calculquebec/frontend-app-authn.git"  # your public/private repo link
    mfes["authn"]["version"] = mfe_version
    mfes["account"]["repository"] = "https://github.com/calculquebec/frontend-app-account.git"  # your public/private repo link
    mfes["account"]["version"] = mfe_version
    return mfes

@MFE_APPS.add()
def _add_catalog_mfe(mfes):
    mfes["catalog"] = {
        "repository": "https://github.com/openedx/frontend-app-catalog.git",
        "port": 1998,
        "version": "master", # optional, will default to the Open edX current tag.
    }
    return mfes

catalog_mfe_url = """
CATALOG_MICROFRONTEND_URL = "http://{{ MFE_HOST }}:{{ get_mfe('catalog').port }}/catalog"
"""

env_items = [
    (
        "openedx-common-settings",
        catalog_mfe_url,
    ),
    (
        "openedx-lms-common-settings",
        "ENABLE_CATALOG_MICROFRONTEND = True",
    ),
]

for item in env_items:
    hooks.Filters.ENV_PATCHES.add_item(item)
