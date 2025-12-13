import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import TicketsPage from './pages/TicketsPage';
import AdminTicketsPage from './pages/AdminTicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import HomePage from './pages/HomePage';
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
      <Route path="/" element={<HomePage />}></Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="admin/tickets" element={<AdminTicketsPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
