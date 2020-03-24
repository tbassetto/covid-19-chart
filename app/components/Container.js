import { Box } from "@chakra-ui/core";

export default function Container(props) {
  return (
    <Box
      width="100%"
      maxWidth="54rem"
      px="1rem"
      {...props}
    />
  );
}
