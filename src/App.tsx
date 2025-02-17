import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PremiumCompanies from './pages/PremiumCompanies'
import AddNewDevice from './pages/AddNewDevices.tsx'
import ModifyClass from './pages/ModifyClass'
import { DataProvider } from './context/DataContext.tsx';

import {ThemeProvider } from '@mui/material';
import magentaTheme from './theme.ts';
import NavBar from './components/NavBar.tsx';
import Footer from './components/Footer.tsx';
import './App.css'

function App() {
  return (
    <ThemeProvider theme={magentaTheme}>
      <DataProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavBar />
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
              <Routes>
                <Route path="/" element={<PremiumCompanies />} />
                <Route path="/add-device" element={<AddNewDevice />} />
                <Route path="/update-class" element={<ModifyClass />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
