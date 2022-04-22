'use strict';

const functions = require('@google-cloud/functions-framework');
const escapeHtml = require('escape-html');

functions.http('helloGET', (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')}!`);
});
