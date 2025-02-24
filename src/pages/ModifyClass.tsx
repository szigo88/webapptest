import { useState } from 'react';
import { TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import { useData } from '../context/DataContext';
import '../App.css';

const ModifyClass = () => {
  // Context adatok
  const { devices, classesMap, companiesMap, updateDeviceClass } = useData();

  // State-ek a kiválasztott IP-hez és új besoroláshoz
  const [selectedIp, setSelectedIp] = useState('');
  const [newClassId, setNewClassId] = useState(0);

  // Űrlap elküldése
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIp && newClassId > 0) {
      updateDeviceClass(selectedIp, newClassId);                                // Besorolás frissítése a context-ben
      setSelectedIp('');                                                        // State-ek reset
      setNewClassId(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        BESOROLÁS MÓDOSÍTÁSA
      </Typography>
      <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
        <TextField                                                              // Eszköz kiválasztása
          fullWidth
          select
          label="Eszköz kiválasztása"
          value={selectedIp}
          onChange={e => setSelectedIp(e.target.value)}
          sx={{ mb: 2 }}
        >
          {devices.map(device => {
            const company = companiesMap.get(device.company_id);  // Kapcsolódó vállalat és besorolás keresése
            const deviceClass = classesMap.get(device.class_id);
            return (
              <MenuItem key={device.ip} value={device.ip}>
                {device.device} <span style={{ marginLeft: 1}}>➤</span> ({device.ip}) <span style={{ marginLeft: 1}}>➤</span> {company?.name || 'Ismeretlen cég'} ➤➤➤ Jelenlegi: {deviceClass?.type}
              </MenuItem>
            );
          })}
        </TextField>

        {selectedIp && (
          <TextField                                                              // Új Besorolás
            fullWidth
            select
            label="Új besorolás"
            value={newClassId}
            onChange={e => setNewClassId(Number(e.target.value))}
            sx={{ mb: 2 }}
          >
            {Array.from(classesMap.values()).map(c => (
              <MenuItem key={c.id} value={c.id}>
                {c.type} ({c.recovery})
              </MenuItem>
            ))}
          </TextField>
        )}

        <Button                                                                    // Mentés gomb
          fullWidth 
          variant="contained" 
          type="submit"
          disabled={!selectedIp || newClassId === 0}
        >
          Mentés
        </Button>
      </Box>
    </form>
  );
};

export default ModifyClass;