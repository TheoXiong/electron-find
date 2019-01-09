const { remote, ipcRenderer } = require('electron')
const { FindInPage } = require('../src/index.js')

let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  preload: true,
  offsetTop: 4,
  offsetRight: 6
})

ipcRenderer.on('on-find', (e, args) => {
  findInPage.openFindWindow()
})

