// Multilingual support for LMS and static pages
// Provide display name for custom language code 'mu' (Multilingual / Multilingue)
const intlObj = typeof Intl !== 'undefined' ? Intl : null;
if (intlObj && intlObj.DisplayNames && !intlObj.DisplayNames._hasCustomOf) {
  const originalDisplayNamesOf = intlObj.DisplayNames.prototype.of;
  intlObj.DisplayNames.prototype.of = function(code) {
    if (code === 'mu') {
      try {
        const locale = (this.resolvedOptions().locale || '').toLowerCase();
        return locale.startsWith('fr') ? 'Multilingue' : 'Multilingual';
      } catch (e) {
        return 'Multilingual';
      }
    }
    return originalDisplayNamesOf.call(this, code);
  };
  intlObj.DisplayNames._hasCustomOf = true;
}

// Multilingual title rewriter for structural elements ({fr}...{/fr}{en}...{/en})
(function initMultilingualTitles() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Only transform in learner-facing views (do not modify in Studio or Authoring MFE)
  const isStudioOrAuthoring = () => {
    try {
      const hostname = (window.location.hostname || '').toLowerCase();
      const pathname = (window.location.pathname || '').toLowerCase();
      return (
        hostname.startsWith('studio.') ||
        hostname.includes('authoring') ||
        pathname.startsWith('/authoring')
      );
    } catch (e) {
      return false;
    }
  };

  if (isStudioOrAuthoring()) {
    return;
  }

  const getCurrentLang = () => {
    try {
      if (typeof getLanguage === 'function') {
        return getLanguage();
      }
      const cookie = document.cookie.split('; ').find(function(c) {
        return c.startsWith('openedx-language-preference=');
      });
      if (cookie) {
        return decodeURIComponent(cookie.split('=')[1]);
      }
      const navLang = navigator.languages?.[0] || navigator.language;
      if (navLang) {
        return navLang;
      }
    } catch (e) {
      // ignore
    }
    return 'fr-ca';
  };

  const parseMultilingualText = (text, targetLang) => {
    if (typeof text !== 'string' || text.indexOf('{') === -1) {
      return text;
    }
    const lang = (targetLang || 'fr').toLowerCase().split('-')[0];
    const tagBlockRegex = /(?:\{([a-zA-Z]{2,3})\}([\s\S]*?)\{\/\1\}\s*)+/g;

    return text.replace(tagBlockRegex, function(matchBlock) {
      const itemRegex = /\{([a-zA-Z]{2,3})\}([\s\S]*?)\{\/\1\}/g;
      const matches = {};
      let m;
      while ((m = itemRegex.exec(matchBlock)) !== null) {
        matches[m[1].toLowerCase()] = m[2].trim();
      }
      return matches[lang] || matches['fr'] || matches['en'] || Object.values(matches)[0] || '';
    });
  };

  const processNode = (node, targetLang) => {
    if (!node) return;

    // Process text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const val = node.nodeValue;
      if (val && val.indexOf('{') !== -1) {
        const parsed = parseMultilingualText(val, targetLang);
        if (parsed !== val) {
          node.nodeValue = parsed;
        }
      }
      return;
    }

    // Process elements
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = (node.tagName || '').toUpperCase();
      // Skip editable fields and script/style elements
      if (
        tagName === 'SCRIPT' ||
        tagName === 'STYLE' ||
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        node.isContentEditable
      ) {
        return;
      }

      // Check common title attributes
      ['title', 'aria-label', 'alt'].forEach(function(attr) {
        if (node.hasAttribute && node.hasAttribute(attr)) {
          const attrVal = node.getAttribute(attr);
          if (attrVal && attrVal.indexOf('{') !== -1) {
            const parsedAttr = parseMultilingualText(attrVal, targetLang);
            if (parsedAttr !== attrVal) {
              node.setAttribute(attr, parsedAttr);
            }
          }
        }
      });

      // Walk children
      let child = node.firstChild;
      while (child) {
        const next = child.nextSibling;
        processNode(child, targetLang);
        child = next;
      }
    }
  };

  // Intercept document.title setter so dynamic title updates (e.g. from React
  // or any script that assigns to document.title) are also translated.
  const titleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
  if (titleDescriptor && titleDescriptor.set && titleDescriptor.get) {
    const originalTitleSet = titleDescriptor.set;
    const originalTitleGet = titleDescriptor.get;
    Object.defineProperty(document, 'title', {
      get() {
        return originalTitleGet.call(this);
      },
      set(value) {
        const parsed = parseMultilingualText(value, getCurrentLang());
        originalTitleSet.call(this, parsed);
      },
      configurable: true,
    });
  }

  const updatePage = () => {
    const lang = getCurrentLang();
    if (document.title && document.title.indexOf('{') !== -1) {
      document.title = parseMultilingualText(document.title, lang);
    }
    if (document.body) {
      processNode(document.body, lang);
    }
  };

  // Run on initial load and setup MutationObserver
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updatePage);
  } else {
    updatePage();
  }

  let scheduled = false;
  const observer = new MutationObserver(function(mutations) {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function() {
      scheduled = false;
      const lang = getCurrentLang();
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'characterData') {
          processNode(m.target, lang);
        } else if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j++) {
            processNode(m.addedNodes[j], lang);
          }
        }
      }
    });
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    });
  }
})();
