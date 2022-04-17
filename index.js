'use strict';

const functions = require('@google-cloud/functions-framework');
const escapeHtml = require('escape-html');

functions.http('helloGET', (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')}!`);
});

functions.http('getMember', (req, res) => {
  var members = [
    // 开发贡献者
    136407523,1194383041,143575444,314757913,385130282,
    // 初始会员
    108208968,
    128984820,
    136668998,
    107451500,
    141315077,
    303743871,
    117417953,
    319701690,
    142964279,
    125049949,
    353885092,
    // 测试
    916506173, // Arararara
    1059791959, // rerorerore
  ]
  res.send(JSON.stringify(members));
});