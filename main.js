// Modules to control application life and create native browser window
const { app, BrowserWindow, session } = require('electron')
const path = require('node:path')

// 保留域前置配置
app.commandLine.appendSwitch('host-rules',
                             'MAP discord.com ez4dc,'
                             +'MAP discordapp.com ez4dc,'
                             +'MAP discord.gg ez4dc,'
                             +'MAP click.discord.com ez4dc,'
                             +'MAP remote-auth-gateway.discord.gg ez4dc,'
                             +'MAP gateway.discord.gg ez4dc_gateway,'
                             +'MAP cdn.discordapp.com ez4dc,'
                             +'MAP wss://gateway.discord.gg ez4dc_gateway,'
                             +'MAP status.discord.com ez4dc,'
                             +'MAP *.hcaptcha.com ez4hcaptcha'
                             )
app.commandLine.appendSwitch('host-resolver-rules',
                             ' MAP ez4dc 162.159.136.232,'
                             +' MAP ez4dc_gateway 162.159.134.234,'
                             +' MAP cdn_ez4dc 162.159.135.233,'
                             +' MAP dis2 162.159.129.233,'
                             +' MAP ez4dc_3 162.159.130.234,'
                             +' MAP ez4hcaptcha 104.19.230.21'
                             )
app.commandLine.appendSwitch('test-type')
app.commandLine.appendSwitch('ignore-certificate-errors')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程中使用 Node.js
      contextIsolation: false, // 关闭上下文隔离
      webviewTag: true,
      webSecurity: false,  // 禁用 web 安全策略
      allowRunningInsecureContent: true  // 允许不安全内容
    }
  })

  // hCaptcha 请求拦截配置
  const filter = {
    urls: [
      '*://*.hcaptcha.com/*',
      'https://*.hcaptcha.com/*',
      'http://*.hcaptcha.com/*'
    ]
  };

  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      const newHeaders = {
        ...details.requestHeaders,
        'Origin': 'https://newassets.hcaptcha.com',
        'Referer': 'https://newassets.hcaptcha.com/',
        'Host': new URL(details.url).host
      };
      callback({ requestHeaders: newHeaders });
    }
  );

  session.defaultSession.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      const responseHeaders = {
        ...details.responseHeaders,
        'access-control-allow-origin': ['https://newassets.hcaptcha.com'],
        'access-control-allow-methods': ['*'],
        'access-control-allow-headers': ['*'],
        'access-control-allow-credentials': ['true'],
        'access-control-max-age': ['86400'],
        'vary': ['Origin']
      };

      callback({ 
        responseHeaders: responseHeaders,
        statusLine: 'HTTP/1.1 200 OK'
      });
    }
  );

  mainWindow.maximize();
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
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
