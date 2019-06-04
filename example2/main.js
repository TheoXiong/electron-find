const electron = require('electron')
const { app, BrowserWindow, globalShortcut } = electron
const path = require('path')
let win
const winURL = 'file://' + path.normalize(`${__dirname}/outer.html`)

function createWindow () {   
  win = new BrowserWindow({ 
    width: 1280,
    height: 1040,
    center: false,
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
      } 
  })
  win.loadURL(winURL)
  //win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })

  win.on('focus', () => {
    globalShortcut.register('CommandOrControl+F', function () {
      if (win && win.webContents) {
        win.webContents.send('on-find', '')
      }
    })
  })
  win.on('blur', () => {
    globalShortcut.unregister('CommandOrControl+F')
  })
  
}
  
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  globalShortcut.unregister('CommandOrControl+F')
})

app.on('activate', () => {
  if (win === null) createWindow()
})

