import { Box, Flex } from "@chakra-ui/core";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { curveBasis } from "@vx/curve";
import { localPoint } from "@vx/event";
import { Grid } from "@vx/grid";
import { Group } from "@vx/group";
import { withParentSize } from "@vx/responsive";
import { scaleBand, scaleLinear, scaleTime } from "@vx/scale";
import { Circle, Line, LinePath } from "@vx/shape";
import { TooltipWithBounds, useTooltip } from "@vx/tooltip";
import { bisector, extent } from "d3-array";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { useState } from "react";

const formatTime = timeFormat("%B %d, %Y");
const formatThousands = format(",");

const Chart = props => {
  const [verticalLine, setVerticalLine] = useState({
    show: false,
    ds: [],
    circles: []
  });
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip
  } = useTooltip();
  const { data, yAxis, category, countries, parentWidth } = props;
  const width = parentWidth;
  const height = 600;
  const margin = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 80
  };
  const per100000 = yAxis === "per100000";

  const handleMouseMove = event => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const x0 = xScale.invert(coords.x - margin.left);
    const anyCountry = data.find(l => l.name === countries[0].name);
    const index = bisectDate(anyCountry.data, x0, 1);
    const d0 = anyCountry.data[index - 1];
    const d1 = anyCountry.data[index];
    let d = d0;
    let i = index;
    if (d0 && d1) {
      d =
        x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf()
          ? d1
          : d0;
      index;
      i = d === d1 ? index : index - 1;
    }
    const circles = countries.map(country => {
      const found = data.find(l => l.name === country.name);
      return {
        name: country.name,
        color: country.color,
        d: found.data[i]
      };
    });
    setVerticalLine({ show: true, d: d, circles: circles });
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: {
        date: d.date,
        circles
      }
    });
  };

  let series = countries.map(country => {
    const found = data.find(l => l.name === country.name);
    return {
      name: country.name,
      color: country.color,
      population: found.population,
      data: found.data
    };
  });

  if (per100000) {
    series = series.map(country => {
      return {
        ...country,
        data: country.data.map(data => ({
          ...data,
          deaths: (data.deaths / country.population) * 100000,
          confirmed: (data.confirmed / country.population) * 100000
        }))
      };
    });
  }
  const allData = series.reduce((acc, d) => acc.concat(d.data), []);

  // accessors
  const getX = d => new Date(d.date);
  const getY = d => d[category];

  const bisectDate = bisector(getX).left;

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
    domain: extent(allData, getX)
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, Math.max(...allData.map(getY))]
    // nice: true
  });

  const yScaleForCountries = scaleBand({
    domain: series.map((_, i) => i),
    paddingOuter: 1
  });
  yScaleForCountries.rangeRound([0, height - 200]);

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="#fcfcfc" rx={4} />
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
                x={d => xScale(getX(d))}
                y={d => yScale(getY(d))}
                stroke={country.color}
                strokeWidth={2}
                curve={curveBasis}
              />
            </Group>
          );
        })}
        {verticalLine.show && (
          <Group top={margin.top} left={margin.left}>
            <Line
              from={{ x: xScale(getX(verticalLine.d)), y: 0 }}
              to={{ x: xScale(getX(verticalLine.d)), y: yMax }}
              stroke="#CBD5E0"
              style={{ pointerEvents: "none" }}
            />
            {verticalLine.circles.map(circle => {
              return (
                <Circle
                  key={circle.name}
                  cx={xScale(getX(circle.d))}
                  cy={yScale(getY(circle.d))}
                  r={4}
                  fill={circle.color}
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
            })}
          </Group>
        )}
        <Group left={margin.left}>
          <AxisLeft
            top={margin.top}
            left={0}
            scale={yScale}
            numTicks={numTicksForHeight(height)}
            label={
              per100000
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
        <Group left={margin.left} top={margin.top}>
          <rect
            width={xMax}
            height={yMax}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              setVerticalLine({ show: false });
              hideTooltip();
            }}
          />
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipWithBounds
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          <div>
            <strong>{formatTime(new Date(tooltipData.date))}</strong>
          </div>
          {tooltipData.circles.map(circle => (
            <Flex my={1} align="center" direction="row" key={circle.name}>
              <Box
                border="1px solid white"
                rounded={100}
                bg={circle.color}
                h={3}
                w={3}
                mr={1}
              />
              <Flex align="center" flex={1}>
                <Box flex={1} mr={3}>
                  {circle.name}:
                </Box>
                <Box flex={1} textAlign="right">
                  {formatThousands(getY(circle.d))}
                </Box>
              </Flex>
            </Flex>
          ))}
        </TooltipWithBounds>
      )}
    </div>
  );
};

export default withParentSize(Chart);
