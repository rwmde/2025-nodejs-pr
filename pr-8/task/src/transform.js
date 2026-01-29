const { Transform } = require('stream');

class HtmlInjectTransform extends Transform {
  constructor(wsPort) {
    super();
    this.wsPort = wsPort;
    this.buffer = '';
    this.injected = false;
  }

  getInjectionScript() {
    return `
<!-- Live Server WebSocket Client - Auto-injected -->
<script>
(function() {
  // WebSocket connection for live reload
  const ws = new WebSocket('ws://localhost:${this.wsPort}');
  
  ws.onopen = function() {
    console.log('[Live Server] Connected to WebSocket server');
  };
  
  ws.onmessage = function(event) {
    if (event.data === 'reload') {
      console.log('[Live Server] Reloading page...');
      window.location.reload();
    }
  };
  
  ws.onclose = function() {
    console.log('[Live Server] WebSocket connection closed. Attempting to reconnect...');
    // Try to reconnect after 2 seconds
    setTimeout(function() {
      window.location.reload();
    }, 2000);
  };
  
  ws.onerror = function(error) {
    console.error('[Live Server] WebSocket error:', error);
  };
})();
</script>
`;
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    callback();
  }

  _flush(callback) {
    const bodyCloseRegex = /<\/body>/i;
    const match = this.buffer.match(bodyCloseRegex);

    if (match && !this.injected) {
      const injectionScript = this.getInjectionScript();
      this.buffer = this.buffer.replace(
        bodyCloseRegex,
        injectionScript + '</body>',
      );
      this.injected = true;
    }

    this.push(this.buffer);
    callback();
  }
}

module.exports = { HtmlInjectTransform };
