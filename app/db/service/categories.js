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

  addCategory = async (newCategory, parentId, sortOrder) => {
    const resultValue = await appCategories
      .create({
        parent_id: parentId,
        category_name: newCategory.category_name,
        category_descr: newCategory.category_descr,
        sort_order: sortOrder
      })
      .then(result => {
        return result;
      })
      .catch(err => console.error(`Something wrong: ${err}`));

    return resultValue;
  };

  removeCategory = async categoryId => {
    const resultValue = await appCategories
      .destroy({
        where: { id: categoryId }
      })
      .then(result => result)
      .catch(err => console.error(`Something wrong: ${err}`));

    return resultValue;
  };

  updateCategory = async (
    categoryId,
    parentId,
    categoryName,
    categoryDescr,
    sortOrder
  ) => {
    let updateModel = {};

    if (parentId != null) {
      updateModel = { ...updateModel, parent_id: parentId };
    }
    if (categoryName != null) {
      updateModel = { ...updateModel, category_name: categoryName };
    }
    if (categoryDescr != null) {
      updateModel = { ...updateModel, category_descr: categoryDescr };
    }
    if (sortOrder != null) {
      updateModel = { ...updateModel, sort_order: sortOrder };
    }

    return appCategories
      .update(
        { ...updateModel },
        {
          where: { id: categoryId }
        }
      )
      .then(result => result)
      .catch(err => console.error(`Something wrong: ${err}`));
  };
}