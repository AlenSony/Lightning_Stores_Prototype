import { Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage.jsx';
import MainPage from './Components/MainPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/main" element={<MainPage />} />
    </Routes>
  );
}

export default App;
