function setupProxy() {
  const tls = process.env.TLS;
  const conf = [
    {
      context: [
        '/api',
        '/services',
        '/management',
        '/swagger-resources',
        '/v2/api-docs',
        '/v3/api-docs',
        '/h2-console',
        '/auth',
        '/health',
      ],
      target: `http${tls ? 's' : ''}://8080-white-rodent-uscwg2jc.ws-eu03.gitpod.io`,
      secure: false,
      changeOrigin: tls,
    },
  ];
  return conf;
}

module.exports = setupProxy();
