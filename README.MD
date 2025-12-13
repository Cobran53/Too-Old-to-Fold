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

5. **Generate Icons and Splash Screens (Optional)**:
   ```powershell
   cordova-res --skip-config --copy
   ```

6. **Explore the Application**:
   - Once the server is running, open your browser and go to the displayed URL (default: `http://localhost:8100`).

## Additional Notes
- If you encounter issues with the Node.js version, update to the latest LTS version.
- Refer to the [official Ionic documentation](https://ionicframework.com/docs) for more information.

## TODO
1) Finish all web pages (static -> interactive -> dynamic)
   * Welcome (100% done)
   * Dashboard (100% static, 50% interactive)
   * Progress (100% static, 0% interactive)
   * Settings (90% static, 20% interactive)
   * Trainings (100% static, 0% interactive)
   * Calendar (100% static, 10% interactive)
2) make database (10%, workouts done)
3) Make app send notifications (requires 2) (0%)
4) Read sensors and weather api and write in DB (requires 2) (0%)
5) Make .tsfile export (0%)
6) Make .tsfile reader (0%) (requires 2 and 5)
