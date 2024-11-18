import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'test-app/config/environment';
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils, { registerLocale } from 'ember-power-calendar-date-fns';
import { setDefaultOptions } from 'date-fns';
import { de } from 'date-fns/locale';

setDefaultOptions({ locale: de });
registerLocale('de', de);

// const defaultOptions = getDefaultOptions();
// const currentLocale = defaultOptions.locale;

// console.log(currentLocale);

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
