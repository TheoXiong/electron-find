const { remote, ipcRenderer } = require('electron')
const { FindInPage } = require('../src/index.js')

let findInPage = null
const webview1 = document.querySelector('#webview1')
webview1.addEventListener('dom-ready', () => {
  findInPage = new FindInPage(webview1.getWebContents())
  ipcRenderer.on('on-find', (e, args) => {
    findInPage.openFindWindow()
  })
})
webview1.addEventListener('close', () => {
  console.log('webview1 close', )
  if (findInPage) {
    findInPage.destroy()
    findInPage = null
  }
})
webview1.addEventListener('destroyed', () => {
  console.log('webview1 destroyed', )
  if (findInPage) {
    findInPage.destroy()
    findInPage = null
  }
})

webview1.addEventListener('crashed', () => {
  console.log('webview1 crashed', )
  if (findInPage) {
    findInPage.destroy()
    findInPage = null
  }
})

ipcRenderer.on('on-find', (e, args) => {
  findInPage ? findInPage.openFindWindow() : ''
})
