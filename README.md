# COVID-19

## Data sources

- Population: [WorldBank.org](https://data.worldbank.org/indicator/SP.POP.TOTL)
- COVID-19: [Data Repository by Johns Hopkins CSSE](https://github.com/CSSEGISandData/COVID-19)

## Update ./covid-data-19

```bash
git submodule foreach git pull
```

## Update ./population-data-19

Probably not needed, but you can download the data from https://data.worldbank.org/indicator/SP.POP.TOTL.

## Testing the app locally

```bash
cd app
yarn dev
```
