import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import RecPassword from './components/pages/RecPassword';
import RegistroClub from './components/pages/RegistroClub';
import Canchas from './components/pages/Canchas';
import Club from './components/pages/Club';
import PanelAdmin from './components/pages/PanelAdmin';
import Historia from './components/Historia/Historia';
import Usuario from './components/pages/Usuarios';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Home />} />
          <Route path="/club" element={<Home />} />
          <Route path="/cliente" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-password" element={<RecPassword />} />
          <Route path="/registro-club" element={<RegistroClub />} />
          <Route path="/canchas" element={<Canchas />} />
          <Route path="/canchas/:id" element={<Club />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/usuario" element={<Usuario />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
