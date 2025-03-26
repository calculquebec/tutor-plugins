from tutormfe.hooks import PLUGIN_SLOTS

PLUGIN_SLOTS.add_items([
    # Hide the default footer
    (
        "all",
        "footer_slot",
        """
        {
            op: PLUGIN_OPERATIONS.Hide,
            widgetId: 'default_contents',
        }"""
    ),
    # Insert a custom footer
    (
        "all",
        "footer_slot",
        """
        {
            op: PLUGIN_OPERATIONS.Insert,
            widget: {
                id: 'custom_footer',
                type: DIRECT_PLUGIN,
                RenderWidget: () => (
                    <h1>This is the footer.</h1>
                ),
            },
        }"""
    )
])
