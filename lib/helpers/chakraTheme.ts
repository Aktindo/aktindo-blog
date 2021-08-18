import { ColorMode, extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const chakraTheme = extendTheme({ config });
export { chakraTheme };
