# ember-power-calendar-date-fns

Date manipulation, formatting and parsing is too complex for ember-power-calendar to reinvent, so it
has to rely on other well tested libraries for that.

This is the addon that exposes the utils used internally by [ember-power-calendar](https://www.ember-power-calendar.com),
using [date-fns](https://date-fns.org) underneath.

You will want to install this addon if you already use date-fns in your application already, or if
date-fns is your preferred date manipulation library.


## Compatibility

* Ember.js v3.28 or above
* Ember CLI v3.28 or above
* Embroider or ember-auto-import v2


## Installation

```
ember install ember-power-calendar-date-fns date-fns
```

Add the following lines into you `app/app.js` to register this meta addon to `ember-power-calendar`
```
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils from 'ember-power-calendar-date-fns';

registerDateLibrary(DateUtils);
```


## Usage

**Don't use it.**

This library is meant to be used internally by `ember-power-calendar` only.

The API can change in breaking ways based on the needs of Ember Power Calendar.


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
