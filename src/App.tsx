import React from 'react';
import './App.css';
import { Login } from './pages/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Join } from './pages/join';
import { Header } from './components/header';
import { Todo } from './pages/todo';

function App() {
  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-[750px] h-full">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="todo" element={<Todo />} />
            <Route path="join" element={<Join />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
