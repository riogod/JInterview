import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/ji_db.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the file SQlite database.');
});

db.serialize(() => {
  db.each('SELECT * FROM settings', (err, row) => {
    console.log(err);
    console.log(`${row.val}: ${row.val}`);
  });
});

db.close();

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
