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
      script.src = this.externalScripts[keys[i]]['src'];
      script.type = 'text/javascript';
      if ("defer" in this.externalScripts[keys[i]]) {
        script.defer = 'defer' in this.externalScripts[keys[i]];
        document.body.appendChild(script);
      }
      else {
        document.head.appendChild(script);
      }
    }
  }
}
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
