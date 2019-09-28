const AppSettings = require('../models/settings');

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
    AppSettings.update({ val: settingVal }, { where: { var: settingsVar } })
      .then(result => {
        console.log('updated successfully!', result);
        return true;
      })
      .catch(err => console.error(`Something wrong: ${err}`));

    return true;
  };
}
