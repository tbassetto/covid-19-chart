import { Flex } from "@chakra-ui/core";

export default function Background(props) {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg="white"
      color="black"
      minH="100vh"
      {...props}
    />
  );
}
