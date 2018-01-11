import { app, Menu, shell, BrowserWindow, dialog } from 'electron';
import { SAVE_TEMPLATE, LOAD_TEMPLATE } from '../_renderer/ui/events';
import { SAVE_MAPPED_COLUMNS } from '../_renderer/ui/features/steps/columns/duck';

export default class MenuBuilder {
  mainWindow: BrowserWindow;
  processingWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow, processingWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.processingWindow = processingWindow;
  }

  buildMenu() {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    let template;

    if (process.platform === 'darwin') {
      template = this.buildDarwinTemplate();
    } else {
      template = this.buildDefaultTemplate();
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.processingWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu
        .buildFromTemplate([{
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }])
        .popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuFile = {
      label: 'File',
      submenu: [
        {
          label: 'Save Template',
          id: 'save_template',
          click: () => {
            dialog.showSaveDialog(this.mainWindow, {
              filters: [{
                name: 'eBundle Template',
                extensions: ['ebndlt']
              }]
            }, (savepath) => {
              if (savepath) {
                this.mainWindow.send(SAVE_TEMPLATE, savepath);
              }
            });
          }
        },
        {
          label: 'Load Template',
          id: 'load_template',
          accelerator: 'Command+O',
          click: () => {
            dialog.showOpenDialog(this.mainWindow, {
              filters: [{
                name: 'eBundle Template',
                extensions: ['ebndlt']
              }]
            }, (openpath) => {
              if (openpath) {
                this.mainWindow.send(LOAD_TEMPLATE, openpath[0]);
              }
            });
          }
        },
        {
          label: 'Save Mapped CSV',
          id: 'save_csv',
          accelerator: 'Command+S',
          click: () => {
            dialog.showSaveDialog(this.mainWindow, {
              filters: [{
                name: 'Mapped Metadata',
                extensions: ['csv', 'dat']
              }]
            }, (savepath) => {
              if (savepath) {
                this.processingWindow.send(SAVE_MAPPED_COLUMNS, savepath);
              }
            });
          }
        },
      ]
    };

    const subMenuAbout = {
      label: 'eBundle Author',
      submenu: [
        { label: 'About eBundle Author', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ElectronReact', accelerator: 'Command+H', selector: 'hide:' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:' },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit(); } }
      ]
    };
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
      ]
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Command+R', click: () => { this.mainWindow.webContents.reload(); } },
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } },
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Command+I', click: () => { this.mainWindow.toggleDevTools(); } },
        { label: 'Toggle Processing Dev Tools', accelerator: 'Alt+Command+I', click: () => { this.processingWindow.toggleDevTools(); } }
      ]
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()); } }
      ]
    };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        { label: 'Learn More', click() { shell.openExternal('http://electron.atom.io'); } },
        { label: 'Documentation', click() { shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme'); } },
        { label: 'Community Discussions', click() { shell.openExternal('https://discuss.atom.io/c/electron'); } },
        { label: 'Search Issues', click() { shell.openExternal('https://github.com/atom/electron/issues'); } }
      ]
    };

    const subMenuView = process.env.NODE_ENV === 'development'
      ? subMenuViewDev
      : subMenuViewProd;

    return [
      subMenuAbout,
      subMenuFile,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [{
      label: '&File',
      submenu: [
        {
          label: 'Save Template',
          accelerator: 'Command+S',
          click: () => {
            dialog.showSaveDialog(this.mainWindow, {
              filters: [{
                name: 'eBundle Template',
                extensions: ['ebndlt']
              }]
            }, (savepath) => {
              if (savepath) {
                this.mainWindow.send(SAVE_TEMPLATE, savepath);
              }
            });
          }
        },
        {
          label: 'Load Template',
          accelerator: 'Command+O',
          click: () => {
            dialog.showOpenDialog(this.mainWindow, {
              filters: [{
                name: 'eBundle Template',
                extensions: ['ebndlt']
              }]
            }, (openpath) => {
              if (openpath) {
                this.mainWindow.send(LOAD_TEMPLATE, openpath[0]);
              }
            });
          }
        }
      ]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click: () => {
          this.mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click: () => {
          this.mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: []
    }];

    return templateDefault;
  }
}
