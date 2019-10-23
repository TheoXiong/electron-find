const { remote, ipcRenderer } = require('electron')
const { FindInPage } = require('../src/index.js')


let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  preload: true,
  offsetTop: 6,
  offsetRight: 10,
  forwardBackwardBorderRadius: 10,
  forwardBackwardRotate: 90,
  caseFont: "Arial",
  closeBorderRadius: 10
})

// let findInPage = new FindInPage(remote.getCurrentWebContents(), {
//   boxBgColor: '#333',
//   boxShadowColor: '#000',
//   inputColor: '#aaa',
//   inputBgColor: '#222',
//   inputFocusColor: '#555',
//   textColor: '#aaa',
//   textHoverBgColor: '#555',
//   caseSelectedColor: '#555',
//   offsetTop: 8,
//   offsetRight: 12
// })

ipcRenderer.on('on-find', (e, args) => {
  findInPage.openFindWindow()
})
