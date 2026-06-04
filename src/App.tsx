import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DesignRoutes } from './routes/DesignRoutes';
import { InviteAcceptPage } from './pages/invite/InviteAcceptPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Navigate to="/design/minimal/login" replace />} />
          <Route path="/invite/:token" element={<ThemeProvider style="minimal"><InviteAcceptPage /></ThemeProvider>} />
          <Route path="/design/*" element={<DesignRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
