# eyersee

IRC client as a [Chrome](https://www.google.com/intl/en/chrome/browser/) app/extension.

```
This project is very much a hack and your mileage will vary, and likely be 0.
```

## getting started

The only way to install this current is from source. If this scares you, this project is not yet for you.

You will need:

* nodejs (0.8+)
* google chrome (latest version, maybe even the dev/canary channel)
* some basic reasoning skills

## Install:

### prebuilt

1. download https://github.com/downloads/shtylman/eyersee/eyersee.crx
1. open chrome://extensions in google chrome
1. drag and drop the downloaded file onto the extensions page

You should now have an icon in your Chrome Apps (or just type `eyersee` in the omnibox) to launch the app.

### from source

1. `git clone` this repo
1. `npm install` to get some dependencies
1. `make`
1. `load unpacked extension` in Chrome on the generated `build` directory

You should now have an icon in your Chrome Apps (or just type `eyersee` in the omnibox) to launch the app.

If the above did not make sense then this project is not yet for you.

