import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from theming.utils import load_file

from tutormfe.hooks import PLUGIN_SLOTS

footer = [
    (
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
            RenderWidget: () => (
            <>
                <style>
                {
                    {load_file("theming/footer/footer.css")}
                }
                </style>
                {load_file("theming/footer/footer.html")}
            </>
            ),
          }},
        }}"""
    )
]

PLUGIN_SLOTS.add_items(
    footer
)

