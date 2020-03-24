import { Grid } from "@vx/grid";
import { Group } from "@vx/group";
import { curveBasis } from "@vx/curve";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { LinePath } from "@vx/shape";
import { scaleTime, scaleLinear, scaleBand } from "@vx/scale";
import { withParentSize } from "@vx/responsive";
import { extent } from "d3-array";

const Chart = (props) => {
  const { data, yAxis, category, countries, parentWidth } = props;
  const width = parentWidth;
  const height = 600;
  const margin = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 80,
  };
  const comparedToTotalPopulation = yAxis === "population";

  let series = countries.map((country) => {
    const found = data.find((l) => l.name === country.name);
    return {
      name: country.name,
      color: country.color,
      population: found.population,
      data: found.data,
    };
  });

  if (!comparedToTotalPopulation) {
    series = series.map((country) => {
      return {
        ...country,
        data: country.data.map((data) => ({
          ...data,
          deaths: (data.deaths / country.population) * 100000,
          confirmed: (data.confirmed / country.population) * 100000,
        })),
      };
    });
  }
  const allData = series.reduce((acc, d) => acc.concat(d.data), []);

  // accessors
  const x = (d) => new Date(d.date);
  const y = (d) => d[category];

  // responsive utils for axis ticks
  function numTicksForHeight(height) {
    if (height <= 300) return 3;
    if (300 < height && height <= 600) return 5;
    return 10;
  }
  function numTicksForWidth(length) {
    // one per week
    return length / 7;
  }

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(allData, x),
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, Math.max(...allData.map(y))],
    nice: true,
  });

  const yScaleForCountries = scaleBand({
    domain: series.map((_, i) => i),
    paddingOuter: 1,
  });
  yScaleForCountries.rangeRound([0, height - 200]);

  return (
    <div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="#fcfcfc" />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={xScale}
          yScale={yScale}
          width={xMax}
          height={yMax}
          numTicksRows={numTicksForHeight(height)}
          numTicksColumns={numTicksForWidth(series[0].data.length)}
        />
        {series.map((country, i) => {
          return (
            <Group key={`lines-${i}`} top={margin.top} left={margin.left}>
              <LinePath
                data={country.data}
                x={(d) => xScale(x(d))}
                y={(d) => yScale(y(d))}
                stroke={country.color}
                strokeWidth={2}
                curve={curveBasis}
              />
            </Group>
          );
        })}
        <Group left={margin.left}>
          <AxisLeft
            top={margin.top}
            left={0}
            scale={yScale}
            numTicks={numTicksForHeight(height)}
            label={
              comparedToTotalPopulation
                ? `${category === "deaths" ? "Deaths" : "Contaminated"} (total)`
                : `${
                    category === "deaths" ? "Deaths" : "Contaminated"
                  } (per 100,000 inhabitants)`
            }
          />
          <AxisBottom
            top={height - margin.bottom}
            left={0}
            scale={xScale}
            numTicks={numTicksForWidth(series[0].data.length)}
            label="Date"
          />
        </Group>
      </svg>
    </div>
  );
};

export default withParentSize(Chart);
