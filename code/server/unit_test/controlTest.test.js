const testService = require('../services/test_service');
const controlTest = require('../modules/controlTest');

// const dao = require('../modules/controlSku');

const controller = new controlTest('EzWh.db');
const test_service = new testService(controller);