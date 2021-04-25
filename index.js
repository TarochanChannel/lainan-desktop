const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: screen.getPrimaryDisplay().size.width/1.2,
        height: screen.getPrimaryDisplay().size.height/1.2,
        minWidth: 800,
        minHeight: 450,
        backgroundColor: "#C5EDEA",
        title: "Lainan"
    });

    win.setMenu(null);
    win.loadFile('app/index.html');
}

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
