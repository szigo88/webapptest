import { Typography, Paper, Grid, Chip } from '@mui/material';
import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import '../App.css';

const PremiumCompanies = () => {
  const { companies, devices, classesMap } = useData();             // Context-ből származó adatok
  const premiumCompanies = useMemo(() => {                          // Prémium vállalatok kiszámítása memoizációval
    return companies
      .map(company => ({
        ...company,
        count: devices.filter(d => 
          d.company_id === company.id && 
          classesMap.get(d.class_id)?.type === 'premium'
        ).length                                                    // Premium számláló
      }))
      .filter(c => c.count > 0)                                     // Legalább 1 premium eszközzel rendelkező vállalatok
      .sort((a, b) => a.name.localeCompare(b.name));                // ABC Rendező
  }, [companies, devices, classesMap]);

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        PRÉMIUM VÁLLALATOK
      </Typography>
      
      {premiumCompanies.length === 0 ? (                            // Feltételes renderelés
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center', 
            mt: 4, 
            color: 'text.secondary' 
          }}
        >
          Jelenleg nincs prémium kategóriás vállalat a rendszerben
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ maxWidth: 1500, margin: '0 auto' }} >
          {premiumCompanies.map(company => (
            <Grid item xs={12} sm={6} md={3} key={company.id}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6">{company.name}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {company.city} • {company.phone}
                </Typography>
                <Chip 
                  label={`${company.count} prémium eszköz`}
                  color="secondary"
                  sx={{ fontWeight: 'bold' }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default PremiumCompanies;