import { GetStaticProps } from "next";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/core";
import ColorHash from "color-hash-ts";
import { withTheme } from "emotion-theming";
import fetch from "isomorphic-unfetch";
import { useState } from "react";

import { CountryData } from "api/src/types";

import Background from "../components/Background";
import Chart from "../components/Chart";
import ComboBox from "../components/ComboBox";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";

const colorHash = new ColorHash({});

export type YAxis = "total" | "per100000";
export type Category = "deaths" | "contaminated";
export type DataWithColor = CountryData & {
  color: string;
};

interface Props {
  data: DataWithColor[];
}
const Index = (props: Props) => {
  // const [yScale, setYScale] = useState("linear"); | "log"
  // const [origin, setOrigin] = useState("sameDay"); | "alignOnFirst"
  const [yAxis, setYAxis] = useState<YAxis>("total");
  const [category, setCategory] = useState<Category>("deaths");
  const [selectedCountries, setSelectedCountries] = useState([
    "China",
    "France",
    "Italy",
    "Spain",
    "US",
  ]);

  const selectedCountriesWithData = selectedCountries.map((country) =>
    props.data.find((c) => c.name === country)
  );
  const hiddenCountries = props.data
    .filter((c) => !selectedCountries.includes(c.name))
    .map((c) => c.name);

  // TODO: extract elsewhere to share between ALL pages
  const lastUpdate = props.data[0].data[props.data[0].data.length - 1].date;

  return (
    <Background>
      <Header />
      <Container flexGrow="1">
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={1}>
          <FormControl mt={4} as="fieldset">
            <FormLabel as="legend">Y axis</FormLabel>
            <RadioGroup
              onChange={(e) => setYAxis(e.target.value as YAxis)}
              value={yAxis}
              isInline
            >
              <Radio value="total">Total</Radio>
              <Radio value="per100000">Per 100,000</Radio>
            </RadioGroup>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel as="legend">Category</FormLabel>
            <RadioGroup
              onChange={(e) => setCategory(e.target.value as Category)}
              value={category}
              isInline
            >
              <Radio value="deaths">Deaths</Radio>
              <Radio value="confirmed">Contaminated</Radio>
            </RadioGroup>
          </FormControl>
        </SimpleGrid>
        <SimpleGrid columns={1} spacing={1}>
          <FormControl my={4}>
            <FormLabel as="legend">Countries</FormLabel>
            <Flex pr={1} direction="row" wrap="wrap">
              {selectedCountriesWithData.map((country) => {
                return (
                  <Tag key={country.name} mr={1} mb={1}>
                    <Box
                      border="1px solid white"
                      rounded={100}
                      bg={country.color}
                      h={4}
                      w={4}
                      mr={1}
                    />
                    <TagLabel>{country.name}</TagLabel>
                    <TagCloseButton
                      onClick={() => {
                        setSelectedCountries((prevState) =>
                          prevState.filter((c) => c !== country.name)
                        );
                      }}
                    />
                  </Tag>
                );
              })}
              <ComboBox
                countries={hiddenCountries}
                onSelect={(country) => {
                  setSelectedCountries((prevState) => {
                    const countries = [...prevState, country];
                    countries.sort();
                    return countries;
                  });
                }}
              />
            </Flex>
          </FormControl>
        </SimpleGrid>
        <Box my={2}>
          <Chart
            countries={selectedCountriesWithData}
            yAxis={yAxis}
            category={category}
          />
        </Box>
      </Container>
      <Footer lastUpdate={lastUpdate} />
    </Background>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("http://localhost:3050/data");
  const json: CountryData[] = await res.json();
  const data = json.map((country) => ({
    ...country,
    color: colorHash.hex(country.name),
  }));
  return { props: { data } };
};

export default withTheme(Index);
