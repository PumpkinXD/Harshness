// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

app.commandLine.appendSwitch(
  "host-rules",
  "MAP cdn.discordapp.com ez4dc_cdn," +
    "MAP discord.com ez4dc," +
    "MAP discordapp.com ez4dc," +
    "MAP discord.gg ez4dc," +
    "MAP discord.media dcez_media," +
    "MAP gateway.discord.gg ez4dc_gateway," +
    "MAP gateway-cf.discord.gg gateway_cf_DIS," +
    "MAP images-ext-1.discordapp.net ez4dc_img_ext_1," +
    "MAP images-ext-2.discordapp.net imgext_ez4dc," +
    "MAP media.discordapp.net ez4dc_media," +
    "MAP medium.com DIS-medium," +
    "MAP remote-auth-gateway.discord.gg ez4dc," +
    "MAP status.discord.com status_DIS," +
    "MAP click.discord.com ez4dc," + // This one could also be grouped with main discord domains
    "MAP *.hcaptcha.com ez4hcaptcha" // Wildcard entries at the end for easier visual separation
); // https://nicebowl.fun/24_8

app.commandLine.appendSwitch(
  "host-resolver-rules",
  "MAP ez4dc 162.159.138.232," +
    "MAP ez4dc_cdn 162.159.130.233," +
    "MAP ez4dc_gateway 162.159.133.234," +
    "MAP ez4dc_img_ext_1 162.159.129.232," +
    "MAP ez4dc_media 162.159.130.232," +
    "MAP dcez_media 162.159.137.234," +
    "MAP DIS-medium 162.159.153.4," +
    "MAP imgext_ez4dc 162.159.128.232," +
    "MAP status_DIS 162.159.135.232," +
    "MAP gateway_cf_DIS 162.159.130.234," +
    "MAP ez4hcaptcha 104.19.230.21" // This line is not working
  // The following rules are commented out and should not be included in the final string
  // 'MAP api2.hcaptcha.com 104.19.230.21,'
  // 'MAP hcaptcha.com 104.19.230.21,'
  // 'MAP newassets.hcaptcha.com 104.19.230.21,'
  // 'MAP imgs.hcaptcha.com 104.19.230.21'
  // Note: The comments above are reserved and are not part of the template string.
); // https://www.diggui.com

app.commandLine.appendSwitch("test-type");
app.commandLine.appendSwitch("ignore-certificate-errors");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
    },
  });

  mainWindow.maximize();
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.loadFile("index.html");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main
// process code. You can also put them in separate files and require them
// here.
