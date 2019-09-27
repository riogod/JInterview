// import { Model } from 'sequelize';

const Sequelize = require('sequelize');
const db = require('../config/database');

const AppSettings = db.define(
  'settings',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    var: Sequelize.STRING,
    val: Sequelize.STRING,
    descr: Sequelize.STRING
  },
  {
    timestamps: false,
    getterMethods: {
      getValue() {
        return this.getDataValue('val');
      }
    }
  }
);

module.exports = AppSettings;
