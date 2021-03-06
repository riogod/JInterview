import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import MainPage from './containers/MainPage';
import SettingPage from './containers/SettingPage';
import StatisticPage from './containers/StatisticPage';
import QuizSessionPage from './containers/QuizSessionPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.STAT} component={StatisticPage} />
      <Route path={routes.SETTINGS} component={SettingPage} />
      <Route path={`${routes.QUIZSESSION}/:id`} component={QuizSessionPage} />
      <Route path={routes.MAIN} component={MainPage} />
    </Switch>
  </App>
);
