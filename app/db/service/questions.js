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

  addQuestionToDb = async (item, categoryId) => {
    const data = {
      parent_id: categoryId,
      question_name: item.itemName,
      question_description: item.itemDescr,
      question_type: item.itemType,
      answer_data:
        item.itemType === 'multi' || item.itemType === 'select'
          ? JSON.stringify(item.answerData.data)
          : item.answerData.text
    };
    console.log('addQuestionToDb', item, data);
    return !item.isEdit
      ? appQuestions.create(data)
      : appQuestions.update(data, {
          where: {
            id: item.editId
          }
        });
  };

  removeQuestion = async itemId => {
    return appQuestions
      .destroy({
        where: { id: itemId }
      })
      .then(result => result)
      .catch(err => console.error(`Something wrong: ${err}`));
  };
}
