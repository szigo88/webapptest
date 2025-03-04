import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useData } from "../context/DataContext";
import { Delete } from "@mui/icons-material";
import "../App.css";

// IP validáló segéd
const validateIP = (ip: string) =>
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip
  );

// Eszköz név validáló segéd
const validateDevice = (device: string) =>
  /^[a-z]{2}-[a-z]{4}-[a-z]-[0-9]{2}$/.test(device);

function AddNewDevice() {
  const { companies, devices, classes, addDevice, deleteDevice, addCompany } = useData(); // Context-ből származó adatok és metódusok
  const [formData, setFormData] = useState({ // Űrlap állapotának kezelése
    device: "",
    ip: "",
    company_id: 0,
    class_id: 1,
    newCompany: "",
    newCompanyPhone: "",
    newCompanyCity: "",
    newCompanyLocation: "",
  });

  // Hibák kezelése
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [companyWarning, setCompanyWarning] = useState<string>("");

  // Valós idejű duplikáció ellenőrzés
  useEffect(() => {
    if (formData.company_id === -1 && formData.newCompany.trim().length > 0) {
      const duplicate = companies.find(
        (c) => c.name.toLowerCase() === formData.newCompany.trim().toLowerCase()
      );
      if (duplicate) {
        setCompanyWarning(
          "Ezzel a névvel már létezik cég. Kérjük, válaszd ki a listából!"
        );
      } else {
        setCompanyWarning("");
      }
    } else {
      setCompanyWarning("");
    }
  }, [formData.newCompany, companies, formData.company_id]);

  // Űrlap validációja -> Minden OK -> return True
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    // Közelező mezők 
    if (!formData.device.trim()) newErrors.device = "Kötelező mező";
    if (!formData.ip.trim()) newErrors.ip = "Kötelező mező";
    if (formData.company_id === 0) newErrors.company_id = "Kötelező mező";
    // Eszköz név és IP validálás
    if (formData.device && !validateDevice(formData.device)) newErrors.device = "Érvénytelen eszköz név - (helyes: ab-abcd-a-01";
    if (formData.ip && !validateIP(formData.ip))
      newErrors.ip = "Érvénytelen IP";
    if (devices.some((d) => d.ip === formData.ip))
      newErrors.ip = "IP cím foglalt";

    if (formData.company_id === -1) { // Közelező mezők
      if (!formData.newCompany.trim()) newErrors.newCompany = "Kötelező mező";
      if (!formData.newCompanyPhone.trim())
        newErrors.newCompanyPhone = "Kötelező mező";
      if (!formData.newCompanyCity.trim())
        newErrors.newCompanyCity = "Kötelező mező";
      if (!formData.newCompanyLocation.trim())
        newErrors.newCompanyLocation = "Kötelező mező";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Űrlap elküldése
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      let selectedCompanyId = formData.company_id;
      if (formData.company_id === -1) {
        // Ellenőrizzük ismét a duplikációt beküldéskor
        const duplicateCompany = companies.find(
          (company) =>
            company.name.toLowerCase() ===
            formData.newCompany.trim().toLowerCase()
        );
        if (duplicateCompany) {
          selectedCompanyId = duplicateCompany.id;
          // A figyelmeztetés már megjelent a useEffect által.
        } else {
          const newCompanyId = addCompany({
            name: formData.newCompany,
            phone: formData.newCompanyPhone,
            city: formData.newCompanyCity,
            location: formData.newCompanyLocation,
          });
          selectedCompanyId = newCompanyId;
        }
      }
      addDevice({ // Új eszköz hozzáadása a context-hez
        ...formData,
        company_id: selectedCompanyId,
      });
      setFormData({  // Űrlap reset
        device: "",
        ip: "",
        company_id: 0,
        class_id: 1,
        newCompany: "",
        newCompanyPhone: "",
        newCompanyCity: "",
        newCompanyLocation: "",
      });
      setErrors({});
      // Figyelmeztetés esetén nem töröljük, hogy látható maradjon
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        ESZKÖZ HOZZÁADÁSA
      </Typography>
      <form onSubmit={handleSubmit}>
         {/* ESZKÖZ NÉV */}
        <TextField
          fullWidth
          label="Eszköz neve  (minta: ab-abcd-a-01)"
          value={formData.device}
          onChange={(e) =>
            setFormData((p) => ({ ...p, device: e.target.value }))
          }
          error={!!errors.device}
          helperText={errors.device}
          sx={{ mb: 2 }}
        />
        {/* IP CÍM */}
        <TextField
          fullWidth
          label="IP cím"
          value={formData.ip}
          onChange={(e) => setFormData((p) => ({ ...p, ip: e.target.value }))}
          error={!!errors.ip}
          helperText={errors.ip}
          sx={{ mb: 2 }}
        />
        {/* VÁLLALAT */}
        <TextField
          fullWidth
          select
          label="Vállalat"
          value={formData.company_id}
          onChange={(e) =>
            setFormData((p) => ({
              ...p,
              company_id: Number(e.target.value),
            }))
          }
          error={!!errors.company_id}
          helperText={errors.company_id}
          sx={{ mb: 2 }}
        >
          <MenuItem value={0}>Válasszon céget...</MenuItem>
          <MenuItem value={-1}>Új vállalat hozzáadása...</MenuItem>
          {companies
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
        </TextField>
        {formData.company_id === -1 && (
          <>
            {/* ÚJ VÁLLALAT */}
            <TextField
              fullWidth
              label="Új vállalat neve"
              value={formData.newCompany}
              onChange={(e) =>
                setFormData((p) => ({ ...p, newCompany: e.target.value }))
              }
              error={!!errors.newCompany}
              helperText={errors.newCompany}
              sx={{ mb: 2 }}
            />
            {companyWarning && (
              <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                {companyWarning}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Telefonszám"
              value={formData.newCompanyPhone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, newCompanyPhone: e.target.value }))
              }
              error={!!errors.newCompanyPhone}
              helperText={errors.newCompanyPhone}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Város"
              value={formData.newCompanyCity}
              onChange={(e) =>
                setFormData((p) => ({ ...p, newCompanyCity: e.target.value }))
              }
              error={!!errors.newCompanyCity}
              helperText={errors.newCompanyCity}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Cím"
              value={formData.newCompanyLocation}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  newCompanyLocation: e.target.value,
                }))
              }
              error={!!errors.newCompanyLocation}
              helperText={errors.newCompanyLocation}
              sx={{ mb: 2 }}
            />
          </>
        )}
        {/* BESOROLÁS */}
        <TextField                                                                  // Besorolás
          fullWidth
          select
          label="Besorolás"
          value={formData.class_id}
          onChange={e => setFormData(p => ({ ...p, class_id: Number(e.target.value) }))}
          sx={{ mb: 2 }}
        >
          {classes.map((cls) => (
            <MenuItem key={cls.id} value={cls.id.toString()}>{cls.type}
            </MenuItem>
          ))}
        </TextField>
        {/* HOZZÁADÁS GOMB */}
        <Button fullWidth variant="contained" type="submit" size="large">
          Eszköz hozzáadása
        </Button>
      </form>

      <Typography variant="h5" sx={{ textAlign: "center", mt: 4 }}>
        Meglévő eszközök
      </Typography>
      {devices.length > 0 ? (
        <List>
          {devices.map((device) => (
            <ListItem
              key={device.ip}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteDevice(device.ip)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={`${device.device} - ${device.ip}`} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mt: 2, color: "gray" }}
        >
          Nincs elérhető eszköz
        </Typography>
      )}
    </Box>
  );
}

export default AddNewDevice;
