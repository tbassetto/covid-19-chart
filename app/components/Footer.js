import { Flex, Text } from "@chakra-ui/core";

export default function Footer({ lastUpdate }) {
  return (
    <Flex
      width="100%"
      justifyContent="center"
      alignItems="center"
      bg="gray.400"
      py={2}
    >
      <Text fontSize="sm">
        Last data update: <em>{lastUpdate}</em>. Made by{" "}
        <a href="https://twitter.com/tbassetto">@tbassetto</a>.{" "}
        <a href="https://github.com/tbassetto/covid-19-chart">
          <em>source</em>
        </a>
      </Text>
    </Flex>
  );
}
