// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

app.commandLine.appendSwitch('host-rules',
                             'MAP discord.com ez4dc,'
                             +'MAP discordapp.com ez4dc,'
                             +'MAP discord.gg ez4dc,'
                             +'MAP remote-auth-gateway.discord.gg ez4dc,'
                             +'MAP *.hcaptcha.com ez4hcaptcha'//not working
                             )//https://nicebowl.fun/24_8
app.commandLine.appendSwitch('host-resolver-rules',
                             ' MAP ez4dc 162.159.138.232,'
                             +' MAP dis2 162.159.129.233,'
                             +' MAP ez4dc_3 162.159.130.234,'
                             +' MAP ez4hcaptcha 104.19.230.21'//not working
                             // +' MAP api2.hcaptcha.com 104.19.230.21,'
                             // +' MAP hcaptcha.com 104.19.230.21,'
                             // +' MAP newassets.hcaptcha.com 104.19.230.21,'
                             // +' MAP imgs.hcaptcha.com 104.19.230.21'
                             )//https://www.diggui.com
app.commandLine.appendSwitch('test-type')
app.commandLine.appendSwitch('ignore-certificate-errors')


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })



  mainWindow.maximize();
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.loadURL('https://discord.com/app');
  // mainWindow.loadURL('https://baidu.com');

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
