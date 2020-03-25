import { Flex, Heading, Icon } from "@chakra-ui/core";
import Link from "next/link";

import Meta from "./Meta";

export default function Header(props) {
  const title = `COVID-19 Chart${props.title ? ` — ${props.title}` : ""}`;
  return (
    <>
      <Meta title={title} />
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        bg="gray.800"
        color="#fff"
        borderBottomColor="black"
        borderBottomWidth="1px"
      >
        <Flex
          width="100%"
          align="center"
          maxWidth="54rem"
          px="4"
          py="4"
          justify="space-between"
        >
          <Link href="/">
            <a>
              <Flex align="center">
                <Icon name="logo" size="40px" mr="2" color="green.500" />
                <Heading size="xl">COVID-19 Chart</Heading>
              </Flex>
            </a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
        </Flex>
      </Flex>
    </>
  );
}
