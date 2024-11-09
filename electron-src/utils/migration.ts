import Database from "better-sqlite3";

interface Migration {
  version: number;
  up: string;
  down: string;
}

const migrations: Migration[] = [
  {
    version: 1,
    up: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `,
    down: `DROP TABLE schema_migrations;`,
  },
  // Add more migrations as needed
];

export function migrate(db: Database.Database): void {
  // Create migrations table if it doesn't exist
  db.exec(migrations[0].up);

  // Get current version
  const currentVersion = db
    .prepare("SELECT MAX(version) as version FROM schema_migrations")
    .get() as { version: number };

  const version = currentVersion?.version || 0;

  // Apply pending migrations
  migrations.forEach((migration) => {
    if (migration.version > version) {
      db.transaction(() => {
        db.exec(migration.up);
        db.prepare("INSERT INTO schema_migrations (version) VALUES (?)").run(
          migration.version
        );
      })();
    }
  });
}
