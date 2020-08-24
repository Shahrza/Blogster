import React from 'react';
import './App.css';
import Header from './components/static/Header';
import Home from './components/home/Home';
import Subscribe from './components/static/Subscribe';
require('dotenv').config();

function App() {
  return (
    <div data-spy="scroll" data-target=".site-navbar-target" data-offset="300">
      <div className="site-wrap">
        <Header />
        <Home />
        <Subscribe />
      </div>
    </div>
  );
}

export default App;
