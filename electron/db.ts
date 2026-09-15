import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

// Exportamos la variable de la base de datos
export let db: Database.Database;

export function initDatabase() {
  const dbPath = app.isPackaged
    ? path.join(app.getPath("userData"), "database.db")
    : path.join(process.cwd(), "database.db");

  // Conexión directa instantánea
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");

  // Crear la tabla si no existe
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      expense_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expense_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      value REAL NOT NULL,
      expense_id INTEGER NOT NULL,
      category_id INTEGER,
      is_auto_generated BOOLEAN NOT NULL,
      is_active BOOLEAN NOT NULL,
      FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE VIEW IF NOT EXISTS v_expenses_summary AS
    SELECT 
      e.id,
      e.description,
      e.expense_date,
      e.created_at,
      COALESCE(SUM(d.value) FILTER (WHERE d.is_active = 1), 0) AS value
    FROM expenses e
    LEFT JOIN expense_details d ON e.id = d.expense_id
    GROUP BY e.id;
  `);
}
