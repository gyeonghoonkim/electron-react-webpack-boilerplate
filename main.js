'use strict'

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const url = require('url')
const fs = require("fs")
const { getDirs } = require('./backend/getDirs')
const { dirsJsonParse } = require('./backend/dirsJsonParse')
const { getFilesInDir } = require('./backend/getFilesInDir')
//const { getData, getData2 } = require("../db/getdata");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Keep a reference for dev mode
let dev = false

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    show: false,
    icon: path.join(__dirname, "src/assets/icons/png/icon.png"),
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
      // preload: path.join(__dirname, "preload.js")
    }
  })
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle("DermaView");
  });

  // and load the index.html of the app.
  let indexPath

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }


  mainWindow.loadURL(indexPath)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const template = [];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// ipcMain.on("latest-query", (event, arg) => {
//   console.log("query from renderer : ", arg);
//   getData2(arg)
//     .then((res) => event.sender.send("sql-return-latest", res))
//     .catch((error) => console.log(error));
// });
ipcMain.on('search_clicked', (event, arg) => {
  // console.log(fs.statSync("/src/assets / dermaview.db"))
  // console.log("test1")
  // console.log(arg['searchValue'])

  const data = getDirs(arg['searchValue'])
  // console.log("test3")
  // console.log(dirs)
  event.reply("send_dirs", data)
})

ipcMain.on('request_dirs', (event, arg) => {
  // console.log('request_dirs')
  const parsedDirs = dirsJsonParse()
  event.reply("load_dirs", parsedDirs)
  // console.log(parsedDirs['2002']['2002-01'])
  // console.log(parsedDirs)
})

ipcMain.on('folder_clicked', (event, arg) => {

  const data2 = getFilesInDir(arg)

  event.reply("send_folder_dirs", data2)

})
