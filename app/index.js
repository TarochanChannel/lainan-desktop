const { app, BrowserWindow, screen, nativeTheme, ipcMain } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: screen.getPrimaryDisplay().size.width / 1.2,
        height: screen.getPrimaryDisplay().size.height / 1.2,
        minWidth: 400,
        minHeight: 720,
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: "#808080",
        title: "Lainan",
        frame: false,
        icon: "icon_pngs/icon.png"
    });

    win.setMenu(null);
    win.loadFile('view/index.html');
    //win.openDevTools();
    ipcMain.on('onload', (event, arg) => {
        event.reply("theme", (nativeTheme.shouldUseDarkColors) ? "dark" : "light");
    });

    ipcMain.on("close", (event, arg) => {
        win.close();
    });
    ipcMain.on("maximize", (event, arg) => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        };
    });
    ipcMain.on("minimize", (event, arg) => {
        win.minimize();
    });
    ipcMain.on("goside", (event, arg) => {
        if (win.isMaximized()) {
            win.unmaximize();
        };
        win.setSize(400, screen.getPrimaryDisplay().size.height, true);
        win.setPosition(screen.getPrimaryDisplay().size.width - 400, 0, true);
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
