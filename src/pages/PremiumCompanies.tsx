import { Typography, Paper, Grid, Chip, Tooltip } from "@mui/material";
import { useMemo } from "react";
import { useData } from "../context/DataContext";
import "../App.css";

const PremiumCompanies = () => {
  const { companies, devices, classesMap } = useData(); // Context-ből származó adatok
  const premiumCompanies = useMemo(() => { // Prémium vállalatok kiszámítása memoizációval
    return companies.map((company) => {
        // Szűrjük az adott céghez tartozó prémium eszközöket
        const premiumDevices = devices.filter((d) => d.company_id === company.id && //Premium devices szűrése
            classesMap.get(d.class_id)?.type === "premium"
        //Az adott eszköz (d) cég azonosítójának (company_id) meg kell egyeznie az aktuális cég (company) azonosítójával.
        // classesMap.get(d.class_id)?.type === 'premium'
        // classesMap egy térkép (Map), amelyből az eszköz osztályát (class_id) lekérjük.
        // Az operátor ?. az opcionális láncolás, ami azt jelenti, hogy ha classesMap.get(d.class_id) nem található (undefined), 
        // akkor nem dob hibát, hanem az egész kifejezés undefined-ként értékelődik.
        // A lekért osztály (class) típusát (type) hasonlítjuk össze a 'premium' stringgel.
        // Csak azok az eszközök maradnak, amelyeknél az osztály típusa pontosan 'premium'.
        );
        return {
          ...company,
          count: premiumDevices.length,                        // Premium számláló
          premiumDevices: premiumDevices.map((d) => d.device), // Az eszközök nevei
        };
      })
      .filter((c) => c.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [companies, devices, classesMap]);

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        PRÉMIUM VÁLLALATOK
      </Typography>

      {premiumCompanies.length === 0 ? (  // Feltételes renderelés,
        <Typography                       // Ha nincs egyetlen prémium eszközzel rendelkező cég, akkor egy üzenetet jelenít meg:
          variant="body1"                 // ("Jelenleg nincs prémium kategóriás vállalat a rendszerben").
          sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}
        >
          Jelenleg nincs prémium kategóriás vállalat a rendszerben
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ maxWidth: 1500, margin: "0 auto" }}>
          {premiumCompanies.map((company) => (  // végigmegy a premiumCompanies tömbön, és megjeleníti a cég kért adatait (name,city,phone)
            <Grid item xs={12} sm={6} md={3} key={company.id}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6">{company.name}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {company.city} • {company.phone}
                </Typography>
                {/* Tooltip - megjeleníti a prémium eszközök neveit */}
                <Tooltip title={company.premiumDevices.join(", ")} arrow>
                  <Chip
                    label={`${company.count} prémium eszköz`}
                    color="secondary"
                    sx={{ fontWeight: "bold" }}
                  />
                </Tooltip>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default PremiumCompanies;

