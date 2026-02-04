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
            id: 'custom_footer',
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
#comment to trigger a rebuild

PLUGIN_SLOTS.add_items(
    header + mobile_header + learning_header + footer + home_banner + logo_href
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
    mfe_version = "cq/ulmo.prod"
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
    (
        "openedx-lms-common-settings",
        "ENABLE_CATALOG_MICROFRONTEND = True",
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

# Workaround for broken edx-search for catalog frontend in ulmo.1
# https://discuss.openedx.org/t/backend-not-ready-for-catalog-mfe-in-latest-version-ulmo-1/18287/8
INSTALL_SEARCH_440 = r"""
RUN --mount=type=cache,target=/openedx/.cache/pip,sharing=shared \
    pip install "edx-search==4.4.0"
"""

hooks.Filters.ENV_PATCHES.add_items([
    ("openedx-dockerfile-post-python-requirements", INSTALL_SEARCH_440),
    ("openedx-dev-dockerfile-post-python-requirements", INSTALL_SEARCH_440),
])
