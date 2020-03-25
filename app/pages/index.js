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
import ColorHash from "@hugojosefson/color-hash";
import { withTheme } from "emotion-theming";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
import { useState } from "react";
import Background from "../components/Background";
import Chart from "../components/Chart";
import ComboBox from "../components/ComboBox";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";

const colorHash = new ColorHash();

const Index = (props) => {
  const [yAxis, setYAxis] = useState("population");
  const [category, setCategory] = useState("deaths");
  const [selectedCountries, setSelectedCountries] = useState([
    "China",
    "France",
    "Italy",
    "Norway",
    "US",
  ]);

  const hiddenCountries = props.countries
    .filter((c) => !selectedCountries.includes(c.name))
    .map((c) => c.name);
  const selectedCountriesWithColor = selectedCountries.map((country) => ({
    name: country,
    // TODO: implement error handling
    color: props.countries.find((c) => c.name === country).color,
  }));

  const lastUpdate = props.data[0].data[props.data[0].data.length - 1].date;

  return (
    <Background>
      <Head>
        <title>COVID-19 Chart</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header title="COVID-19 Chart" />
      <Container flexGrow="1">
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={1}>
          <FormControl mt={4} as="fieldset">
            <FormLabel as="legend">Y axis</FormLabel>
            <RadioGroup
              onChange={(e) => setYAxis(e.target.value)}
              value={yAxis}
              isInline
            >
              <Radio value="population">Total population</Radio>
              <Radio value="per100000">Per 100,000</Radio>
            </RadioGroup>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel as="legend">Category</FormLabel>
            <RadioGroup
              onChange={(e) => setCategory(e.target.value)}
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
            <Flex pr={1} direction="horizontal" wrap="wrap">
              {selectedCountriesWithColor.map((country) => {
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
            data={props.data}
            yAxis={yAxis}
            category={category}
            countries={selectedCountriesWithColor}
          />
        </Box>
      </Container>
      <Footer lastUpdate={lastUpdate} />
    </Background>
  );
};

export async function getStaticProps() {
  const res = await fetch("http://localhost:3050/data");
  const data = await res.json();
  const countries = data.map((country) => ({
    name: country.name,
    color: colorHash.hex(country.name),
  }));
  return { props: { countries, data } };
}

export default withTheme(Index);
