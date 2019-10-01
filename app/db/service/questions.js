// const Sequelize = require('sequelize');
const appQuestions = require('../models/questions');
// const db = require('../config/database');
// const { Op } = Sequelize;

export default class DbServiceQuestions {
  getQuestionItems = async parentId => {
    const resultValue = await appQuestions
      .findAll({
        attributes: [
          'id',
          'parent_id',
          'question_name',
          'question_description',
          'question_type',
          'answer_data'
        ],
        where: { parent_id: parentId }
      })
      .then(result => {
        return result;
      })
      .catch(err => console.error(`Something wrong: ${err}`));

    return resultValue;
  };
}
