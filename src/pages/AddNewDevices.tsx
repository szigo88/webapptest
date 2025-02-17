import React, { useState } from 'react';
import { Button, TextField, MenuItem, Typography, Box } from '@mui/material';
import { useData } from '../context/DataContext';
import '../App.css';

// IP validáló segéd
const validateIP = (ip: string) => 
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);

// Eszköz név validáló segéd
const validateDevice = (device: string) =>
  /^[a-z]{2}-[a-z]{4}-[a-z]-[0-9]{2}$/.test(device);


function AddNewDevice() {
  const { companies, devices, addDevice } = useData();      // Context-ből származó adatok és metódusok
  const [formData, setFormData] = useState({                // Űrlap állapotának kezelése
    device: '',
    ip: '',
    company_id: 0,
    class_id: 1
  });

  // Hibák kezelése
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Űrlap validációja -> Minden OK -> return True
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.device.trim()) newErrors.device = 'Kötelező mező';                // Közelező mezők
    if (!formData.ip.trim()) newErrors.ip = 'Kötelező mező';
    if (formData.company_id === 0) newErrors.company_id = 'Kötelező mező';
    
    // Eszköz név és IP validálás
    if (formData.device && !validateDevice(formData.device)) newErrors.device = "Érvénytelen eszköz név - (helyes: ab-abcd-a-01";
    if (formData.ip && !validateIP(formData.ip)) newErrors.ip = 'Érvénytelen IP';
    if (devices.some(d => d.ip === formData.ip)) newErrors.ip = 'IP cím foglalt';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Űrlap elküldése
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addDevice({                                                                   // Új eszköz hozzáadása a context-hez
        ...formData,
        company_id: formData.company_id,
      });
      setFormData({ device: '', ip: '', company_id: 0, class_id: 1 });              // Űrlap reset
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        ESZKÖZ HOZZÁADÁSA
      </Typography>
      <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
        <TextField                                                                  // Eszköznév
          fullWidth
          label="Eszköz neve (ab-abcd-a-01)"
          value={formData.device}
          onChange={e => setFormData(p => ({ ...p, device: e.target.value }))}
          error={!!errors.device}
          helperText={errors.device}
          sx={{ mb: 2 }}
        />

        <TextField                                                                  // IP cím
          fullWidth
          label="IP cím"
          value={formData.ip}
          onChange={e => setFormData(p => ({ ...p, ip: e.target.value }))}
          error={!!errors.ip}
          helperText={errors.ip}
          sx={{ mb: 2 }}
        />

        <TextField                                                                  // Vállalat
          fullWidth
          select
          label="Vállalat"
          value={formData.company_id}
          onChange={e => setFormData(p => ({ ...p, company_id: Number(e.target.value) }))}
          error={!!errors.company_id}
          helperText={errors.company_id}
          sx={{ mb: 2 }}
        >
          <MenuItem value={0}>Válasszon céget...</MenuItem>
          {[...companies]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(company => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
        </TextField>

        <TextField                                                                  // Besorolás
          fullWidth
          select
          label="Besorolás"
          value={formData.class_id}
          onChange={e => setFormData(p => ({ ...p, class_id: Number(e.target.value) }))}
          sx={{ mb: 2 }}
        >
          <MenuItem value={1}>Basic</MenuItem>
          <MenuItem value={2}>Plus</MenuItem>
          <MenuItem value={3}>Premium</MenuItem>
          <MenuItem value={4}>Ultimate</MenuItem>
        </TextField>

        <Button                                                                     // Hozzáadás Gomb
          fullWidth 
          variant="contained" 
          type="submit"
          size="large"
        >
          Eszköz hozzáadása
        </Button>
      </Box>
    </form>
  );
}

export default AddNewDevice;