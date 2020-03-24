import { Flex, Heading } from "@chakra-ui/core";

import Container from "../components/Container";

export default function Header({ title }) {
  return (
    <Flex
      width="100%"
      justifyContent="center"
      alignItems="center"
      bg="gray.200"
    >
      <Container py="0.5rem">
        <Heading size="xl">{title}</Heading>
      </Container>
    </Flex>
  );
}
