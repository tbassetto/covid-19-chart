import Hapi from "@hapi/hapi";
import { promises as fs } from "fs";
import path from "path";
import neatCsv from "neat-csv";

import { DayDatum, NumberPerCountry, CountryData } from "./types";

const PATH_TO_COVID_19_DATA =
  "../covid-19-data/csse_covid_19_data/csse_covid_19_time_series/";

const PATH_TO_POPULATION_DATA = "../population-data/";

const parseRow = (line: neatCsv.Row): DayDatum[] => {
  return Object.entries(line)
    .map(([key, value]) => {
      const parsedKey = /(?<month>0?[1-9]|1[012])(?:\/)(?<day>0?[1-9]|[12]\d|3[01])(?:\/)(?<year>\d{2})/.exec(
        key
      );
      // Ignore columns that are not dates
      if (!parsedKey) return null;
      const {
        groups: { month, day, year },
      } = parsedKey;
      return {
        date: `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        number: Number(value),
      };
    })
    .filter(Boolean);
};
const addLines = (a: DayDatum[], b: DayDatum[]): DayDatum[] => {
  return a.map((entry, i) => {
    return {
      date: entry.date,
      number: entry.number + b[i].number,
    };
  });
};

async function getGlobalData(filename: string): Promise<NumberPerCountry> {
  const rows = await neatCsv(
    await fs.readFile(path.join(PATH_TO_COVID_19_DATA, filename))
  );
  const result = rows.reduce((acc, row: neatCsv.Row) => {
    const countryName = row["Country/Region"];
    if (!acc[countryName]) {
      acc[countryName] = parseRow(row);
    } else {
      // console.debug(`${countryName} already found`, row["Province/State"]);
      acc[countryName] = addLines(acc[countryName], parseRow(row));
    }
    return acc;
  }, {} as NumberPerCountry);
  return result;
}

interface Population {
  countryName: string;
  population: number;
}
interface PopulationPerCountry {
  [countryName: string]: Population;
}
async function readPopulationData(): Promise<PopulationPerCountry> {
  return (
    await neatCsv(
      await fs.readFile(
        path.join(
          PATH_TO_POPULATION_DATA,
          "API_SP.POP.TOTL_DS2_en_csv_v2_887275.csv"
        )
      ),
      { skipLines: 4 }
    )
  ).reduce((acc, row) => {
    acc[row["Country Name"]] = {
      countryName: row["Country Name"],
      population:
        row["Country Name"] === "Eritrea"
          ? Number(row["2011"])
          : Number(row["2018"]),
    };
    return acc;
  }, {} as PopulationPerCountry);
}

const init = async (): Promise<void> => {
  // Population data
  const population = await readPopulationData();

  // COVID-19
  const deaths = await getGlobalData("time_series_covid19_deaths_global.csv");
  const confirmed = await getGlobalData(
    "time_series_covid19_confirmed_global.csv"
  );

  // Start merging data
  const findPopulation = (country: string): number | undefined => {
    // Convert between the 2 datasets
    switch (country) {
      case "Bahamas":
        country = "Bahamas, The";
        break;
      case "Burma":
        country = "Myanmar";
        break;
      case "Brunei":
        country = "Brunei Darussalam";
        break;
      case "Congo (Brazzaville)":
        country = "Congo, Rep.";
        break;
      case "Congo (Kinshasa)":
        country = "Congo, Dem. Rep.";
        break;
      case "Czechia":
        country = "Czech Republic";
        break;
      case "Egypt":
        country = "Egypt, Arab Rep.";
        break;
      case "Gambia":
        country = "Gambia, The";
        break;
      case "Iran":
        country = "Iran, Islamic Rep.";
        break;
      case "Korea, South":
        country = "Korea, Rep.";
        break;
      case "Kyrgyzstan":
        country = "Kyrgyz Republic";
        break;
      case "Laos":
        country = "Lao PDR";
        break;
      case "Russia":
        country = "Russian Federation";
        break;
      case "Saint Lucia":
        country = "St. Lucia";
        break;
      case "Saint Vincent and the Grenadines":
        country = "St. Vincent and the Grenadines";
        break;
      case "Saint Kitts and Nevis":
        country = "St. Kitts and Nevis";
        break;
      case "Slovakia":
        country = "Slovak Republic";
        break;
      case "US":
        country = "United States";
        break;
      case "Venezuela":
        country = "Venezuela, RB";
        break;
      case "Syria":
        country = "Syrian Arab Republic";
        break;
      default:
        break;
    }
    if (country in population) {
      return population[country].population;
    }
    console.warn(`Could not find population data for ${country}`);
  };
  const finalData: CountryData[] = Object.entries(deaths)
    .map(([countryName, deathData]) => {
      return {
        name: countryName,
        population: findPopulation(countryName),
        data: deathData.map((d) => ({
          date: d.date,
          deaths: d.number,
          confirmed: confirmed[countryName].find(
            (entry) => entry.date === d.date
          ).number,
        })),
      };
    })
    .filter((data) => data.population !== undefined);

  const server = Hapi.server({
    port: 3050,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: () => "Hello World!",
  });

  server.route({
    method: "GET",
    path: "/data",
    handler: () => finalData,
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
