import { Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage.jsx';
import MainPage from './Components/MainPage.jsx';
import ItemPage from './Components/ItemPage.jsx';
import ProfilePage from './Components/ProfilePage.jsx';
import SearchPage from './Components/SearchPage.jsx';
import CartPage from './Components/CartPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/item" element={<ItemPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
}

export default App;
