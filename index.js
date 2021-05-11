const { app, BrowserWindow, screen, nativeTheme, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: screen.getPrimaryDisplay().size.width / 1.2,
        height: screen.getPrimaryDisplay().size.height / 1.2,
        minWidth: 800,
        minHeight: 450,
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: "#808080",
        title: "Lainan"
    });

    win.setMenu(null);
    win.loadFile('app/index.html');
    win.openDevTools();
    ipcMain.on('onload', (event, arg) => {
        event.reply("theme", (nativeTheme.shouldUseDarkColors) ? "dark" : "light");
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        };
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});
