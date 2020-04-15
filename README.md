# COVID-19

Just a pet project to try new technologies (Next.js, Chakra UI, GitHub Actions, Netlify, etc.). Also, I live in a small country with a few inhabitants and comparing the total number of deaths to other countries is meaningless, hence a chart to compare data per 100,000 inhabitants.

## Data sources

- Population: [WorldBank.org](https://data.worldbank.org/indicator/SP.POP.TOTL)
- COVID-19: [Data Repository by Johns Hopkins CSSE](https://github.com/CSSEGISandData/COVID-19)

## Testing the app locally

```bash
yarn
yarn dev
```

## TODO

- [ ] Add option to change the x axis (start date mostly)
- [ ] Add option to change the scale (linear/log)
- [ ] Add animations to the chart during transitions

## Update ./covid-data-19

```bash
git submodule update --init
git submodule foreach git checkout master
git submodule foreach git pull
```

## Update ./population-data-19

Probably not needed, but you can download the data from https://data.worldbank.org/indicator/SP.POP.TOTL and update the files.
