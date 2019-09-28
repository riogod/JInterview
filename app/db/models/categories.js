// import { Model } from 'sequelize';

const Sequelize = require('sequelize');
const db = require('../config/database');

const appCategories = db.define(
  'categories',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parent_id: Sequelize.INTEGER,
    category_name: Sequelize.STRING,
    category_descr: Sequelize.STRING,
    sort_order: Sequelize.INTEGER
  },
  {
    timestamps: false
  }
);

module.exports = appCategories;
