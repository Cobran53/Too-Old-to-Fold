# Launch the Ionic Application on Your Computer

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed (version 24.11.1 recommended).
   - [Download Node.js](https://nodejs.org/)

2. **Ionic CLI**: Install the Ionic CLI globally if not already installed:
   ```powershell
   npm install -g @ionic/cli
   ```

3. **Project Dependencies**: All necessary files are provided except the `node_modules` folder. You need to install the dependencies.

## Steps to Launch the Application

1. **Clone the Project or Navigate to the Folder**:
   - If you downloaded the files, navigate to the project folder.

2. **Install Dependencies**:
   ```powershell
   npm install
   ```

3. **Run the Application in the Browser**:
   ```powershell
   ionic serve
   ```

4. **Add a Native Platform (Optional)**:
   - For Android or iOS, add a native platform using Capacitor:
     ```powershell
     ionic capacitor add android
     ionic capacitor add ios
     ```

5. **Explore the Application**:
   - Once the server is running, open your browser and go to the displayed URL (default: `http://localhost:8100`).

## Additional Notes
- If you encounter issues with the Node.js version, update to the latest LTS version.
- Refer to the [official Ionic documentation](https://ionicframework.com/docs) for more information.

## Local database (SQLite)

This project can use a local SQLite database for development. The added files are:

- [db/schema.sql](db/schema.sql): database schema.
- [scripts/init_db.js](scripts/init_db.js): Node script that creates `db/database.sqlite` and inserts sample data.
- [src/services/sqlite.ts](src/services/sqlite.ts): Node helper to open the database from server-side code or scripts.

Steps to initialize the local database:

1. Install dependencies (added to `package.json`):
```powershell
npm install
```
2. Initialize the database (creates `db/database.sqlite`):
```powershell
npm run init-db
```
3. The database file will then be located at `db/database.sqlite`. Scripts and your Node code can open the DB using `src/services/sqlite.ts`.
