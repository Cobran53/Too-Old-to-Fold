import React from 'react';

const StandardHome: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Welcome to the Standard Home Page</h1>
      </header>
      <main>
        <p>This is a simple example of a standard HTML structure within a React component.</p>
        <section>
          <h2>About</h2>
          <p>This application is built using Ionic and Capacitor with React.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>Feel free to reach out to us at <a href="mailto:example@example.com">example@example.com</a>.</p>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Too Old to Fold. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StandardHome;