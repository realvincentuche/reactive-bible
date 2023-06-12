import {
  AppShell,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useDisclosure, useLocalStorage, useWindowEvent } from "@mantine/hooks";
import MyNavbar from "./components/MyNavbar";
import MyHeader from "./components/MyHeader";
import { useState } from "react";
import Passage from "./components/Passage";
import { SearchModal } from "./components/SearchModal";

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "dark",
  });
  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));
  const [opened, setOpened] = useState(false);
  const [modalOpened, modalFn] = useDisclosure(false);
  useWindowEvent("keydown", (event) => {
    if (event.key === "/") {
      event.preventDefault();
      modalFn.open();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      modalFn.close();
    }
  });
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          padding="md"
          navbar={<MyNavbar opened={opened} setOpened={setOpened} />}
          header={
            <MyHeader
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}
              opened={opened}
              setOpened={setOpened}
              open={modalFn.open}
            />
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
              height: "100vh",
            },
          })}
        >
          <Passage open={modalFn.open} />
          <SearchModal opened={modalOpened} close={modalFn.close} />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
