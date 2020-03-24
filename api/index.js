const Hapi = require("@hapi/hapi");
const fs = require("fs").promises;
const path = require("path");
const neatCsv = require("neat-csv");

const PATH_TO_COVID_19_DATA =
  "../covid-19-data/csse_covid_19_data/csse_covid_19_time_series/";

const PATH_TO_POPULATION_DATA = "../population-data/";

const parseLine = (line) => {
  return Object.entries(line)
    .map(([key, value]) => {
      const parsedKey = /(?<month>0?[1-9]|1[012])(?:\/)(?<day>0?[1-9]|[12]\d|3[01])(?:\/)(?<year>\d{2})/.exec(
        key
      );
      if (parsedKey) {
        const {
          groups: { month, day, year },
        } = parsedKey;
        return {
          date: `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
          number: Number(value),
        };
      }
      return null;
    })
    .filter(Boolean);
};
const addLines = (a, b) => {
  return a.map((entry, i) => {
    return {
      date: entry.date,
      number: entry.number + b[i].number,
    };
  });
};
async function getGlobalData(filename) {
  let result = await neatCsv(
    await fs.readFile(path.join(PATH_TO_COVID_19_DATA, filename))
  );
  result = result.reduce((acc, line) => {
    const countryName = line["Country/Region"];
    if (!acc[countryName]) {
      acc[countryName] = parseLine(line);
    } else {
      // console.debug(`${countryName} already found`, line["Province/State"]);
      acc[countryName] = addLines(acc[countryName], parseLine(line));
    }
    return acc;
  }, {});
  return result;
}

async function readPopulationData() {
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
  ).reduce((acc, line) => {
    acc[line["Country Name"]] = {
      countryName: line["Country Name"],
      countryCode: line["Country Code"],
      population: Number(line["2018"]),
    };
    return acc;
  }, {});
}

const init = async () => {
  // COVID-19
  const deaths = await getGlobalData("time_series_covid19_deaths_global.csv");
  const confirmed = await getGlobalData(
    "time_series_covid19_confirmed_global.csv"
  );

  // Population data
  const population = await readPopulationData();

  // Start merging data
  const findPopulation = (country) => {
    // Convert between the 2 datasets
    switch (country) {
      case "Bahamas":
        country = "Bahamas, The";
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
      case "Russia":
        country = "Russian Federation";
        break;
      case "Saint Lucia":
        country = "St. Lucia";
        break;
      case "Saint Vincent and the Grenadines":
        country = "St. Vincent and the Grenadines";
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
  const finalData = Object.entries(deaths)
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
