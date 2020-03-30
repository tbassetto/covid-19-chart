export interface NumberPerCountry {
  [countryName: string]: DayDatum[];
}
export interface DayDatum {
  date: string;
  number: number;
}
export interface CountryData {
  name: string;
  population: number;
  data: {
    date: string;
    deaths: number;
    confirmed: number;
  }[];
}
