// use better-sqlite3 to interact with the database

import Database, { Database as DatabaseType } from 'better-sqlite3';

// create class Database

class SnipDB {
    // create a private property db of type Database
    private db: DatabaseType;

    // create a constructor that takes a string as an argument
    constructor(dbPath: string) {
        // create a new instance of Database and assign it to the db property
        this.db = new Database(dbPath);
        // Ensure the database schema is created
        this.createSchema();
    }

    // Create the database schema if it doesn't exist
    private createSchema() {
        const createSnippetsTable = `
            CREATE TABLE IF NOT EXISTS snippets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                snippet TEXT NOT NULL
            )
        `;
        const createSettingsTable = `
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                settings TEXT NOT NULL
            )
        `;
        this.db.exec(createSnippetsTable);
        this.db.exec(createSettingsTable);
    }

    // create a method query that takes a string as an argument
    query(sql: string) {
        // return the result of calling the prepare method on the db property with the sql argument
        return this.db.prepare(sql);
    }

    // save notes
    saveSnippet(snippet: string) {
        const insert = this.query('INSERT INTO snippets (snippet) VALUES (?)');
        insert.run(snippet);
    }
    // update a note
    updateSnippet(id: number, snippet: string) {
        const update = this.query('UPDATE snippets SET snippet = ? WHERE id = ?');
        update.run(snippet, id);
    }
    // delete a note
    deleteSnippet(id: number) {
        const del = this.query('DELETE FROM snippets WHERE id = ?');
        del.run(id);
    }
    // get all notes
    getSnippets() {
        const select = this.query('SELECT * FROM snippets');
        return select.all();
    }
    // get a single note
    getSnippet(id: number) {
        const select = this.query('SELECT * FROM snippets WHERE id = ?');
        return select.get(id);
    }
    // delete all notes
    deleteAllSnippets() {
        const del = this.query('DELETE FROM snippets');
        del.run();
    }
    // update settings
    updateSettings(settings: string) {
        const update = this.query('UPDATE settings SET settings = ?');
        update.run(settings);
    }
    // get settings
    getSettings() {
        const select = this.query('SELECT * FROM settings');
        return select.get();
    }

    // close the database
    close() {
        this.db.close();
    }

}

export default new SnipDB('./snippets.db');