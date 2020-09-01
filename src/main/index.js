'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9000'
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    devTools: true,
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.webContents.openDevTools()

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
const secondaryWindows = new Set()
const createNewWindow = (locationName) => {
  let newWindow = new BrowserWindow({
    show: true,
    webPreferences: {
      // webSecurity: false,
      nodeIntegration: true
    }
  })

  newWindow.loadURL(winURL)
  // loadURL(`file://${__dirname}/app/index.html`)
  newWindow.once('ready-to-show', () => {
    newWindow.show()
  })

  newWindow.on('closed', () => {
    secondaryWindows.delete(newWindow)
    newWindow = null
  })

  newWindow.webContents.on('did-finish-load', () => {
    newWindow.webContents.send('route', locationName)
  })

  secondaryWindows.add(newWindow)
  return newWindow
}
ipcMain.on('open-new-window', (e, locationName) => {
  createNewWindow(locationName)
})
