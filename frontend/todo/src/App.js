import React from 'react';
import Todo from './components/Todo';
import Header from './components/Header';
import './App.css';  // Make sure to import your CSS file for styling

function App() {
  return (
    <div className="container mt-4 bg-primary">
      <Header />
      <Todo />
    </div>
  );
}

export default App;
