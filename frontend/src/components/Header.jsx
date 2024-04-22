import { Flex } from "@chakra-ui/layout";
import { Image, useColorMode } from "@chakra-ui/react";
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"center"} mt={6} mb={12}>
      <Image
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        alt="logo"
        w={6}
        cursor="pointer"
        onClick={toggleColorMode}
      />
    </Flex>
  );
};

export default Header;
