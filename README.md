# electron-find

## Introduction
Find all matches for the text in electron app

## Install
``` 
$   npm install electron-find --save
```

## Usage
```
# basic usage
const { remote } = require('electron')
const { FindInPage } = require('../src/index.js')

let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  preload: true,
  offsetTop: 4,
  offsetRight: 4
})
findInPage.openFindWindow()

# run demo
npm run e
```
## Shortcut
| keys |   function |
| ------ | ------ | 
| Enter | find next | 
| Shift + Enter| find back |
| Esc | close | 
