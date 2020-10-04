import { useState } from "react";
import { Box, List, Input, ListItem, useTheme } from "@chakra-ui/core";
import { useCombobox } from "downshift";

export default function ComboBox(props) {
  const theme = useTheme();
  const [inputItems, setInputItems] = useState(props.countries);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = useCombobox({
    id: "downshift-combobox",
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        props.countries.filter((item) =>
          item.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem !== null) {
        reset();
        props.onSelect(selectedItem);
      }
    },
  });

  return (
    <Box d="inline-box" pos="relative" w={40} {...getComboboxProps()}>
      <Input
        {...getInputProps()}
        placeholder="Add Country"
        isFullWidth={false}
        size="sm"
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            props.onSelect(event.target.value);
          }
        }}
      />
      <List
        {...getMenuProps()}
        zIndex={10}
        display={isOpen ? "block" : "none"}
        pos="absolute"
        left={0}
        top={8}
        w={200}
        bg="#fff"
        border="1px"
        borderRadius="sm"
        borderColor="gray.200"
      >
        {inputItems.length === 0 ? (
          <ListItem px={3}>No results</ListItem>
        ) : null}
        {inputItems.map((item, index) => (
          <ListItem
            px={3}
            bg={highlightedIndex === index ? theme.colors.blue[500] : ""}
            key={`${item}${index}`}
            {...getItemProps({ item, index })}
          >
            {item}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
