import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DesignRoutes } from './routes/DesignRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Navigate to="/design/minimal/login" replace />} />
          <Route path="/design/*" element={<DesignRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
