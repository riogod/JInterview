const AppSettings = require('../models/settings');

// module.exports = {
//   async getSettingsValue(settingsVar) {
//     let value = null;
//     try {
//       settingsValue = await AppSettings.findOne({
//         attributes: ['var', 'val'],
//         where: { var: settingsVar }
//       });
//       value = settingsValue.getValue;
//       console.log(`Ahhaa: ${settingsValue.getValue}`);
//     } catch (e) {
//       console.error(e);
//     }
//     return value;
//   }
// };

// module.exports = {
//   getSettingsValue(settingsVar) {
//     const result = AppSettings.findOne({
//       attributes: ['var', 'val'],
//       where: { var: settingsVar }
//     })
//       .then(val => val.getValue)
//       .catch(err => console.log(`Something wrong: ${err}`));
//
//     return result;
//   }
// };

export default class DbServiceSettings {
  getSettingsValue = async settingsVar => {
    const resultValue = await AppSettings.findOne({
      attributes: ['var', 'val'],
      where: { var: settingsVar }
    })
      .then(result => {
        return result.getValue;
      })
      .catch(err => console.error(`Something wrong: ${err}`));

    return resultValue;
  };

  setSettingsValue = async (settingsVar, settingVal) => {
    console.log('UPDATE:', settingsVar, settingVal);

    AppSettings.update({ val: settingVal }, { where: { var: settingsVar } })
      .then(result => {
        console.log('updated successfully!', result);
        return true;
      })
      .catch(err => console.error(`Something wrong: ${err}`));

    return true;
  };
}
