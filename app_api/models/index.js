// app_api/models/index.js

const Anstalld = require('./Anstalld');
const Identity = require('./Identity');
const Role = require('./Role');
const Mandate = require('./Mandate');
const Policy = require('./Policy');
const Permission = require('./Permission');
const Layout = require('./Layout');
const Counter = require('./Counter');

module.exports = {
  Anstalld,
  Identity,
  Role,
  Mandate,
  Policy,
  Permission,
  Layout,
  Counter
};