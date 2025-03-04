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
    e.preventDefault();  // e.preventDefault(); → Megakadályozza az alapértelmezett űrlapbeküldési viselkedést (újratöltés helyett az egyéni logikát futtatja le).
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
        <TextField                                                // Eszköz kiválasztása
          fullWidth
          select
          label="Eszköz kiválasztása"
          value={selectedIp}                                      // → A kiválasztott érték a selectedIp állapotban van tárolva.
          onChange={e => setSelectedIp(e.target.value)}           // → Amikor a felhasználó választ egy opciót, a selectedIp értéke frissül az új IP-címre.
          sx={{ mb: 2 }}
        >
          {devices.map(device => {                                // → A devices tömb minden egyes elemére végigmegy.
            const company = companiesMap.get(device.company_id);  // → Megkeresi a companiesMap-ből azt a céget, amelynek az azonosítója megegyezik az eszköz company_id-jával.
            const deviceClass = classesMap.get(device.class_id);  // → Lekéri a besorolást, amely megfelel az eszköz class_id értékének.
            return (                                              // → Minden eszközhöz létrehoz egy menüelemet, ahol a kulcs és az érték az eszköz IP címe.
              <MenuItem key={device.ip} value={device.ip}>        
                {device.device} ({device.ip}) - {company?.name || 'Ismeretlen cég'} ➤ Jelenlegi: {deviceClass?.type}
              </MenuItem>                                         // A menüelem tartalma tartalmazza: Az eszköz nevét: device.device, Az IP címet zárójelben: ({device.ip})
                                                                  // A kapcsolódó cég nevét, vagy ha nem található, akkor az „Ismeretlen cég” feliratot és a jelenlegi besorolást
            );
          })}
        </TextField>

        {selectedIp && (                                           // segítségével ellenőrzi, hogy van-e kiválasztott eszköz (azaz a selectedIp értéke nem üres).
          <TextField                                               // Új Besorolás - csak akkor jelenik meg az "Új besorolás" legördülő mező, ha van kiválasztott IP
            fullWidth
            select
            label="Új besorolás"
            value={newClassId}                                      // A kiválasztott besorolás ID-je a newClassId állapotban van tárolva.
            onChange={e => setNewClassId(Number(e.target.value))}   // Az eseménykezelő frissíti a newClassId értékét azáltal, hogy a kiválasztott értéket számmá konvertálja.
            sx={{ mb: 2 }}
          >
            {Array.from(classesMap.values()).map(c => (             // Menüelemek generálása: A classesMap értékeit átalakítja egy tömbbé az Array.from(classesMap.values()) metódussal.
              <MenuItem key={c.id} value={c.id}>                    
                {c.type} ({c.recovery} másodperc helyreállítás)     
              </MenuItem>                                            // Minden egyes osztályra (c) létrehoz egy <MenuItem>-et, ahol key és value: Az osztály azonosítója (c.id).
                                                                     // Megjelenített szöveg: Az osztály típusa (c.type)
            ))}
          </TextField>
        )}

        <Button                                                                    // Mentés gomb
          fullWidth 
          variant="contained" 
          type="submit"
          disabled={!selectedIp || newClassId === 0}                    // addig inaktív amíg a selectedIp vagy newClassId üres
        >
          Mentés
        </Button>
      </Box>
    </form>
  );
};

export default ModifyClass;

