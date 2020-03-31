import { Text } from "@chakra-ui/core";

import Background from "../components/Background";
import Header from "../components/Header";

export default function About() {
  return (
    <Background>
      <Header title="About" />
      <Text>This is a test</Text>
    </Background>
  );
}
