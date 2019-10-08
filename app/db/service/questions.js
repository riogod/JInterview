const Sequelize = require('sequelize');
const appQuestions = require('../models/questions');
const db = require('../config/database');
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

  // Selecting all subcategories and count elements in that categories
  getAllSubElements = async categoryId => {
    return db
      .query(
        `with name_tree as
              (
              select id, parent_id, category_name
               from categories
               where id = ${categoryId}
               union all
               select C.id, C.parent_id, C.category_name
               from categories as C
					join name_tree p on C.parent_id = P.id
					AND C.id<>C.parent_id
              )
            select *, (SELECT count(id) FROM questions WHERE questions.parent_id = name_tree.id) as qcount from name_tree;`
      )
      .then(res => {
        return res[0];
      })
      .catch(err => console.error(`Something wrong: ${err}`));
  };

  // Complite to-do: Нужна функция которая бы выбирала рандомные элементы в процентном соотношении от количества подкатегорий,
  //        например: из 4 дочерних категорий нам надо выбрать 20 вопросов,
  //        при этом в категориях у нас следующее количество вопросов:
  //        1 - 3 вопроса, 2 - 10 вопросов, 3 - 1 вопрос, 4 - 20 вопросов
  //        Формула: CategoyElemCount*(QuestionNeededToSelect/AllElemCount) - Далее логикой поправить ситуации когда
  //        например один вопрос в категории
  //    dbCategory.getQuestionToInterview(5, 20)
  //       .then(res => res)
  //       .catch(e => {console.log(e)});
  getQuestionToInterview = async (categoryId, elementsNeeded) => {
    return this.getAllSubElements(categoryId)
      .then(data => {
        const valOfAllElements = data.reduce((a, b) => a + b.qcount, 0);
        const tmpData = data.map(el => {
          const val =
            elementsNeeded <= valOfAllElements
              ? Math.ceil(el.qcount * (elementsNeeded / valOfAllElements))
              : el.qcount;
          return { ...el, questionsToSelect: val };
        });

        const valOfAllNeededElements = tmpData.reduce(
          (a, b) => a + b.questionsToSelect,
          0
        );

        if (valOfAllNeededElements > elementsNeeded) {
          const indexMax = tmpData.indexOf(
            tmpData.reduce(
              (prev, cur) =>
                cur.questionsToSelect > prev.questionsToSelect ? cur : prev,
              { questionsToSelect: -Infinity }
            )
          );
          tmpData[indexMax] = {
            ...tmpData[indexMax],
            questionsToSelect:
              tmpData[indexMax].questionsToSelect -
              (valOfAllNeededElements - elementsNeeded)
          };
        }

        const selectArray = tmpData.map(el => {
          return el.qcount > 0
            ? appQuestions.findAll({
                order: Sequelize.literal('random()'),
                limit: el.questionsToSelect,
                where: { parent_id: el.id }
              })
            : null;
        });

        return Promise.all(selectArray.filter(el => el != null))
          .then(result => {
            return result.flat();
          })
          .catch(err => console.error(`Something wrong: ${err}`));
      })
      .catch(err => console.error(`Something wrong: ${err}`));
  };
}
