import React from 'react';
import { Route, Routes } from 'react-router-dom'
import './App.css';
import { NavBar } from './components/NavBar'
import { IndexPage } from './pages'
import { TodosPage } from './pages/todos'

function App() {
  return (
    <div className="max-w-7xl px-5 py-5 mx-auto">
      <NavBar />
      <Routes>
        <Route path='/' element={<IndexPage />}/>
        <Route path='/todos' element={<TodosPage />}/>
      </Routes>
    </div>
  );
}

export default App;
