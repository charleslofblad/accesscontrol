/*
export interface Anstalld {
    _id: string;
    Fornamn: string;
    Efternamn: string;
    Personnummer: string;
    Roll: string;
    Chef: string;
    Tjanstekort?: {
      RCO?: string;
      EM_kod?: string;
      Mifare_kod?: string;
    };
    BildURL?: string;  // ✅ Lägg till BildURL
  }

*/

  export interface Anstalld {
    _id?: string; // ✅ Lägg till denna rad
    Anstallda_ID: number;
    FulltNamn?: string;  // Matchar "Fullt namn"
    Fornamn: string;
    Efternamn: string;
    Personnummer: string;
    Reff_Pnr: string;  // Nyckel från API
    Roll: string;
    Chef: string;
    Layout: string;  // Ny nyckel
    Foretag?: string;  // Kan vara tomt enligt API

    Tjanstekort?: {
      Tjanstekort_ID: number;
      Datum: number;
      EM_kod?: number;
      Mifare_kod?: number;
      Alliera_Bla?: string;
      Alliera_Gron?: string;
      RCO?: number;
      _id?: string;
    };

    BildURL?: string;  // ✅ Redan inkluderad
}

  