import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import initialData from "../data.json";

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
  companiesMap: Map<number, Company>; // <Company.id, Company>
  classesMap: Map<number, Class>; // <class.id, Class>
  // a Device típusból eltávolítjuk a company_id tulajdonságot, & -> interfész összevonás (intersection) operátor (&), 
  // amely két típus kombinációját jelenti és aztán újra hozzáadjuk number típussal
  addDevice: (device: Omit<Device, "company_id"> & { company_id: number }) => void; 
  updateDeviceClass: (ip: string, newClassId: number) => void; 
  deleteDevice: (ip: string) => void;
  addCompany: (newCompany: Omit<Company, "id"> & { name: string }) => number;
}

// Üres kezdeti context létrehozása
const DataContext = createContext<DataContextType>({} as DataContextType);

// Validáló függvények - Ellenőrzi, hogy egy adat megfelel-e a Company interfésznek.
// Typeguard függvény, data is Company → Type Predicate (Típusvédő kifejezés)
const isValidCompany = (data: any): data is Company =>
  typeof data.id === "number" &&
  typeof data.name === "string" &&
  typeof data.phone === "string";

const isValidDevice = (data: any): data is Device =>
  typeof data.company_id === "number" &&
  typeof data.device === "string" &&
  typeof data.ip === "string";

// Adatszolgáltató Komponens ( Adat betöltés / mentés localstorage-ba, Állapotkezelés, Keresések)
// Egy React komponens, amely az egész alkalmazás számára biztosít adatokat.
// A children segítségével beágyazott komponenseket fogadhat el
// { children: React.ReactNode } → Ez azt mondja, hogy a children bármilyen React-elem lehet (React.ReactNode).
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false); //Statek Inicializálása
  const [companies, setCompanies] = useState<Company[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const classes = initialData.Class; // Az értéke nem változik dinamikusan az alkalmazás futása során, tehát nincs szükség a React állapotkezelésére (useState)

  // Lookup táblák memoizálása
  const companiesMap = useMemo(
    () =>
      // Reactben useMemo segítségével optimalizáljuk, hogy csak változás esetén frissüljön.
      new Map(companies.map((c) => [c.id, c])), // végigmegy a cégeken és visszaad egy kulcs(id) érték(maga a cég objektum) tömböt -->  [1, { id: 1, name: 'Cég A', phone: '123-456', city: 'Budapest', location: 'H-101' }],
    [companies]
  ); // Ez azt jelenti, hogy a Map csak akkor frissül, ha a companies állapot megváltozik. Ez segít elkerülni az újragenerálást, ami teljesítményoptimalizációt jelent Reactben.

  const classesMap = useMemo(
    () => new Map(classes.map((c) => [c.id, c])),
    [classes]
  ); // Ez azt jelenti, hogy a Map csak akkor frissül, ha a classes állapot megváltozik. Ez segít elkerülni az újragenerálást, ami teljesítményoptimalizációt jelent Reactben.

  // Kezdeti adatbetöltés
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("appData"); // betölti a localstorage-ot saveData-ba, Az adatokat stringként kapjuk meg a localStorage.getItem() segítségével.
      if (savedData) {
        // Ha a savedData nem null vagy undefined, akkor van mentett adat. beolvassa json -ba
        const parsedData = JSON.parse(savedData);

        // Adatvalidáció
        if (
          Array.isArray(parsedData.companies) && // companies Tömb-e
          Array.isArray(parsedData.devices) && // devices Tömb-e
          parsedData.companies.every(isValidCompany) && //company inteface.nek megfelel-e
          parsedData.devices.every(isValidDevice) // devices interface-nek megfelel-e
        ) {
          setCompanies(parsedData.companies); // Ha mind megfelel akkor json-ban menti a companies-ba és a devices-ba
          setDevices(parsedData.devices);
        } else {
          throw new Error("!Hibás adat!"); // Ha bármelyik validáció sikertelen, akkor hibát dob, és a catch ágba lép.
        }
      } else {
        // egyáltalán Nincs is mentett adat -> alapértelmezettek betöltése
        setCompanies(initialData.Company);
        setDevices(initialData.Device);
      }
    } catch (error) {
      console.error("!Hiba a localStorage betöltésénél:", error);
      setCompanies(initialData.Company); // Visszaállít alapértelmezett adatokra és hibát dob
      setDevices(initialData.Device);
    } finally {
      // A finally blokk mindig lefut, akár sikeres volt az adatbetöltés, akár nem.
      setIsDataLoaded(true); // beállítja isLoaded-ot true-ra
    }
  }, []);

  // Adatmentés, ha betöltődtek az adatok - akkor fut le, ha változik a companies, devices vagy isDataLoaded állapot.
  // Ha az isDataLoaded feltétel nélkül futna, akkor az alapértelmezett értékeket elmentené még azelőtt, hogy a localStorage-ból való betöltés megtörtént volna.
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(
        "appData",
        JSON.stringify({
          // A localStorage.setItem() segítségével a companies és devices adatokat JSON-formátumban menti el az 'appData' kulcs alatt.
          companies,
          devices,
        })
      );
    }
  }, [companies, devices, isDataLoaded]); // Ez a useEffect akkor fut le, ha változik a companies, devices vagy isDataLoaded állapot.

  // Új eszköz hozzáadása
  const addDevice = (newDevice: Omit<Device, "company_id"> & { company_id: number }) => {
    // Omit<Device, 'company_id'> & { company_id: number } típus biztosítja, hogy a company_id mindig szám legyen.
    setDevices((prev) => [...prev, newDevice as Device]); // Az új eszközt a setDevices a korábbi állapot (prev) másolásával és az új eszköz hozzáfűzésével frissíti.
  }; // A TypeScript nem tudja garantálni, hogy a newDevice tényleg megfelel a Device típusnak.
  // Az as Device kényszeríti, hogy Device típusúnak tekintse az objektumot.

  // Eszköz besorolásának frissítése
  // Megkeresi a devices listában azt az eszközt, amelynek az ip címét megadtuk, és frissíti annak class_id értékét.
  const updateDeviceClass = (ip: string, newClassId: number) => {
    setDevices((prev) =>
      prev.map(
        (device) =>
          device.ip === ip ? { ...device, class_id: newClassId } : device // : device --> Ha nem egyezik, akkor változatlanul hagyja az eszközt.
      )
    );
  };

  // Eszköz törlése
  const deleteDevice = (ip: string) => {
    setDevices((prev) => prev.filter((device) => device.ip !== ip));
  };

  // Új vállalat hozzáadása
  const addCompany = (
    newCompany: Omit<Company, "id"> & { name: string }
  ): number => {
    // Új egyedi id generálása: ha van már cég, a legnagyobb id + 1, egyébként 1
    const newId =
      companies.length > 0 ? Math.max(...companies.map((c) => c.id)) + 1 : 1;
    const companyToAdd: Company = {
      id: newId,
      name: newCompany.name,
      phone: newCompany.phone || "",
      city: newCompany.city || "",
      location: newCompany.location || "",
    };
    setCompanies((prev) => [...prev, companyToAdd]);
    return newId;
  };

  // egy React Context van létrehozva és egy egyedi hook (useData), amely ezt a contextet könnyen elérhetővé teszi a komponensek számára.
  return (
    <DataContext.Provider
      value={{
        companies,
        devices,
        classes,
        companiesMap,
        classesMap,
        addDevice,
        updateDeviceClass,
        deleteDevice,
        addCompany,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

/*
DataContext.Provider biztosítja, hogy a DataContext-hez tartozó adatok minden gyermek komponens számára elérhetők legyenek.
A value tulajdonságban adja át az adatokat és függvényeket:
companies – A cégek listája
devices – Az eszközök listája
classes – Az osztályok listája (initialData.Class alapján)
companiesMap és classesMap – objektummá alakított adatok a gyorsabb kereséshez
addDevice, updateDeviceClass ... – Függvények az eszközök kezelésére

useData – Egyedi hook a context egyszerű eléréséhez

export const useData = () => useContext(DataContext);

Egyedi React hook (useData), amely egyszerűbbé teszi a DataContext használatát.
A useContext(DataContext) meghívásával visszaadja a contextben tárolt értékeket.
Így a komponensekben nem kell mindenhol useContext(DataContext)-et írni, elég annyi, hogy:

const { companies, devices, addDevice } = useData();

DataContext.Provider	Elérhetővé teszi az adatokat és műveleteket a gyermek komponensek számára
useData hook	Egyszerűsíti a context adatok elérését a komponensekben
*/
