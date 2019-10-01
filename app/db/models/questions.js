// import { Model } from 'sequelize';

const Sequelize = require('sequelize');
const db = require('../config/database');

const appQuestions = db.define(
  'questions',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parent_id: Sequelize.INTEGER,
    question_name: Sequelize.STRING,
    question_description: Sequelize.STRING,
    question_type: Sequelize.STRING,
    answer_data: Sequelize.JSON
  },
  {
    timestamps: false
  }
);

module.exports = appQuestions;
