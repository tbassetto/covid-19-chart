import { Flex, useColorMode } from "@chakra-ui/core";

export default function Background(props) {
  const { colorMode } = useColorMode();

  const bgColor = { light: "white", dark: "gray.900" };

  const color = { light: "black", dark: "white" };
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      minH="100vh"
      {...props}
    />
  );
}
