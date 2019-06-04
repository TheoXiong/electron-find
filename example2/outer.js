const { ipcRenderer } = require('electron')
const { FindInPage } = require('../src/index.js')

let findInPage = null
const webview1 = document.querySelector('#webview1')
webview1.addEventListener('dom-ready', () => {
  findInPage = new FindInPage(webview1.getWebContents())
})
webview1.addEventListener('close', () => {
  if (findInPage) {
    findInPage.destroy()
    findInPage = null
  }
})
webview1.addEventListener('destroyed', () => {
  if (findInPage) {
    findInPage.destroy()
    findInPage = null
  }
})
webview1.addEventListener('crashed', () => {
  if (findInPage) {
    findInPage.destroy()
    findInPage = null
  }
})

ipcRenderer.on('on-find', (e, args) => {
  findInPage ? findInPage.openFindWindow() : ''
})
