import { app, BrowserWindow } from "electron";
//import { createRequire } from "node:module";
import { fileURLToPath } from "url";
import path from "path";
import { UserController } from "./modules/user/controllers/user.controller";
import { ExpenseController } from "./modules/expenses/controllers/expense.controller";
import { initDatabase } from "./db";
import { CategoryController } from "./modules/expenses/controllers/category.controller";
//const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let userControler: UserController;
let expenseController: ExpenseController;
let categoryController: CategoryController;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    console.time("6. loadURL");

    win.webContents.on("dom-ready", () => {
      console.log("DOM READY");
    });

    win.webContents.on("did-finish-load", () => {
      console.log("DID FINISH LOAD");
    });

    win.loadURL(VITE_DEV_SERVER_URL).then(() => {
      console.timeEnd("6. loadURL");
    });
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  try {
    console.time("1. initDatabase");
    initDatabase();
    console.timeEnd("1. initDatabase");

    console.time("2. UserController");
    userControler = new UserController();
    userControler.registerRoutes();
    console.timeEnd("2. UserController");

    console.time("3. ExpenseController");
    expenseController = new ExpenseController();
    expenseController.registerRoutes();
    console.timeEnd("3. ExpenseController");

    console.time("4. CategoryController");
    categoryController = new CategoryController();
    categoryController.registerRoutes();
    console.timeEnd("4. CategoryController");

    console.time("5. createWindow");
    createWindow();
    console.timeEnd("5. createWindow");
  } catch (error) {
    console.log("No se pudo iniciar la app", error);
  }
});
