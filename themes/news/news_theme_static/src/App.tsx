import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Archive from './pages/Archive';
import SinglePost from './pages/SinglePost';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:category" element={<Archive />} />
          <Route path="post/:id" element={<SinglePost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
