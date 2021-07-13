# electron-find

English | [简体中文](./README.zh-CN.md)

## Introduction
Find all matches for the text in electron app

## Features
- depend on the API of electron's findInPage
- support user config UI of find interface
- support case-sensitive
- Auto find when user inputing is change
- The find interface is separated from electron view
- support electron version ^1.8.0, ^2.0.0, ^3.0.0, ^4.0.0
- support platform of Windows, Linux, Mac

## Demo

### Default UI
![demo](./find.gif)

### Custom UI
![demo](./find2.png)

## Install
``` 
$   npm install electron-find --save
```

## Usage
```
# import module
import { remote, ipcRenderer } from 'electron'
import { FindInPage } from 'electron-find'

# create instance of FindInPage with default config
let findInPage = new FindInPage(remote.getCurrentWebContents())
findInPage.openFindWindow()

# use preload option, the find interface will be loaded when create instance
let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  preload: true
})
findInPage.openFindWindow()

# config parentElement of find interface, default is document.body
let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  parentElement: document.querySelector('#id')
})
findInPage.openFindWindow()

# config duration of find interface moving, default is 300 (ms)
let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  duration: 200
})
findInPage.openFindWindow()

# config offset relative to parentElement
let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  offsetTop: 20,
  offsetRight: 30
})
findInPage.openFindWindow()

# config UI of find interface 
let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  boxBgColor: '#333',
  boxShadowColor: '#000',
  inputColor: '#aaa',
  inputBgColor: '#222',
  inputFocusColor: '#555',
  textColor: '#aaa',
  textHoverBgColor: '#555',
  caseSelectedColor: '#555'
})
findInPage.openFindWindow()

# there is a simply demo for reference
npm install
npm run dev

# there is another example with webview
npm install
npm run dev:webview
```
## Shortcut
| keys   |   function  |
| ------ | ------      | 
| Enter  | find next   | 
| Shift + Enter| find back |
| Esc    | close | 

 Besides, you can also register global shortcut to open the find window, just like the demo.

 ## API
 ### Class: FindInPage
 ` new FindInPage(webContents, [options]) `
- ` webContents ` Object(required) - The webContents of renderer process
- ` options ` Object(optional)
   - ` preload ` Boolean - Whether load the find interface when create instance. Default is `false`.
   - ` parentElement ` Object - Specify parent dom of the find interface. Default is `document.body`.
   - ` duration ` Number - Specify moving time when the find window open or close. Default is `300` (ms).
   - ` offsetTop ` Number - Specify offset relative to the top of parentElement. Default is `5`.
   - ` offsetRight ` Number - Specify offset relative to the right of parentElement. Default is `5`.
   - ` boxBgColor ` String - Specify background color of the find interface. Default is `"#ffffff"`.
   - ` boxShadowColor ` String - Specify shadow color of the find interface. Default is `"#909399"`.
   - ` inputColor ` String - Specify text color of the input form. Default is "#606266".
   - ` inputBgColor ` String - Specify background color of the input form. Default is `"#f0f0f0"`.
   - ` inputFocusColor ` String - Specify border color of the input form when focusing. Default is `"#c5ade0"`.
   - ` textColor ` String - Specify color of the text in find interface. Default is `"#606266"`.
   - ` textHoverBgColor ` String - Specify background color of text in find interface when hovering. Default is `"#eaeaea"`.
   - ` caseSelectedColor ` String - Specify border color of the matchCase button when selected. Default is `"#c5ade0"`.

 ### Instance Methods
 Objects created with new FindInPage have the following instance methods:      
 &nbsp;  
  ` findInPage.openFindWindow() `  
 Open the find window when it is closed. Focus input form when the find window has opened.  
 &nbsp;   
  ` findInPage.closeFindWindow() `  
 Close the find window when it has opened.  
 &nbsp;   
  ` findInPage.destroy() `  
 Close the find window, and release memory.






