import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import initialData from '../data.json';

export interface Company {
  id: number;
  name: string;
  phone: string;
  city: string;
  location: string;
}

export interface Device {
  company_id: number;
  device: string;
  ip: string;
  class_id: number;
}

export interface Class {
  id: number;
  type: string;
  recovery: string;
}
// Context: Adatlisták, Lookup Mapek (Gyors keresés), Műveleti függvények 
interface DataContextType {
  companies: Company[];
  devices: Device[];
  classes: Class[];
  companiesMap: Map<number, Company>;
  classesMap: Map<number, Class>;
  addDevice: (device: Omit<Device, 'company_id'> & { company_id: number }) => void;
  updateDeviceClass: (ip: string, newClassId: number) => void;
}

// Üres kezdeti context létrehozása
const DataContext = createContext<DataContextType>({} as DataContextType);

// Validáló függvények
const isValidCompany = (data: any): data is Company => 
  typeof data.id === 'number' && 
  typeof data.name === 'string' &&
  typeof data.phone === 'string';

const isValidDevice = (data: any): data is Device =>
  typeof data.company_id === 'number' &&
  typeof data.device === 'string' &&
  typeof data.ip === 'string';

// Adatszolgáltató Komponens ( Adat betöltés / mentés localstorage-ba, Állapotkezelés, Keresések) 
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);                        //Statek Inicializálása
  const [companies, setCompanies] = useState<Company[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const classes = initialData.Class;

  // Lookup táblák memoizálása
  const companiesMap = useMemo(() => 
    new Map(companies.map(c => [c.id, c])), 
  [companies]);

  const classesMap = useMemo(() => 
    new Map(classes.map(c => [c.id, c])), 
  [classes]);

  // Kezdeti adatbetöltés
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('appData');
      if (savedData) {                                              // Ha van mentett mappa a localStorage-ban, beolvassa json -ba
        const parsedData = JSON.parse(savedData);
        
        // Adatvalidáció
        if (
          Array.isArray(parsedData.companies) &&
          Array.isArray(parsedData.devices) &&
          parsedData.companies.every(isValidCompany) &&
          parsedData.devices.every(isValidDevice)
        ) {
          setCompanies(parsedData.companies);
          setDevices(parsedData.devices);
        } else {
          throw new Error('!Hibás adat!');
        }
      } else {                                                      // Nincs mentett adat -> alapértelmezettek betöltése
        setCompanies(initialData.Company);
        setDevices(initialData.Device);
      }
    } catch (error) {
      console.error('!Hiba a localStorage betöltésénél:', error);
      setCompanies(initialData.Company);                            // Visszaállít alapértelmezett adatokra
      setDevices(initialData.Device);
    } finally {
      setIsDataLoaded(true);
    }
  }, []);

  // Adatmentés, ha betöltődtek az adatok
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('appData', JSON.stringify({ 
        companies, 
        devices 
      }));
    }
  }, [companies, devices, isDataLoaded]);
  
  // Új eszköz hozzáadása
  const addDevice = (newDevice: Omit<Device, 'company_id'> & { company_id: number }) => {
    setDevices(prev => [...prev, newDevice as Device]);
  };
  // Eszköz besorolásának frissítése
  const updateDeviceClass = (ip: string, newClassId: number) => {
    setDevices(prev => prev.map(device => 
      device.ip === ip ? { ...device, class_id: newClassId } : device
    ));
  };

  return (
    <DataContext.Provider value={{ 
      companies, 
      devices, 
      classes,
      companiesMap,
      classesMap,
      addDevice, 
      updateDeviceClass 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);