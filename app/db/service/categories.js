const appCategories = require('../models/categories');

export default class DbServiceCategory {
  getCategories = async parentId => {
    const resultValue = await appCategories
      .findAll({
        attributes: [
          'id',
          'parent_id',
          'category_name',
          'category_descr',
          'sort_order'
        ],
        order: [['sort_order', 'ASC']],
        where: { parent_id: parentId }
      })
      .then(result => {
        return result;
      })
      .catch(err => console.error(`Something wrong: ${err}`));

    return resultValue;
  };
}
