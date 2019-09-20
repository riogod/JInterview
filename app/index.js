import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

// const db = require('./db/config/database');
// const AppSettings = require('./db/models/settings');

// db.authenticate()
//   .then(() => console.log('DB Connected...'))
//   .catch(err => console.log(`Error: ${err}`));

// AppSettings.findAll()
//   .then(settings => {
//     console.log(settings);
//     return true;
//   })
//   .catch(err => console.log(`Something wrong: ${err}`));

// AppSettings.getValue('QUESTION_PER_QUIZSESSION')
//   .then(settingValue => {
//     console.log(`Returned Value: ${settingValue}`);
//     return true;
//   })
//   .catch(err => console.log(`Something wrong: ${err}`));

// console.log(`Returned value:${AppSettings.getValue('QUESTION_PER_QUIZSESSION').then( settingVal => console.log(settingVal))}`);

/*
AppSettings.findOne({
  attributes: ['var', 'val'],
  where: { var: 'QUESTION_PER_QUIZSESSION' }
})
  .then(foundValue => {
    console.log(`Value Eah!:${foundValue.getValue}`);

    return foundValue.dataValues.val;
  })
  .catch(err => console.log(`Something wrong: ${err}`));

*/

// const AppSettingsService = require('./db/service/settings');

// console.log(
//   `WOOOOO:${AppSettingsService.getSettingsValue('QUESTION_PER_QUIZSESSION').then(val => val)}`
// );

// const fta = AppSettingsService.getSettingsValue('QUESTION_PER_QUIZSESSION')
//   .then( result => {
//     console.log(`WOOOOHOOO:${result}`);
//     return true;
//   })
//   .catch(err => console.log(`Something wrong: ${err}`));
//
// console.log(`FTA:${fta}`);

const store = configureStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
