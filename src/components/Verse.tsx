import { Box, Text, Title, createStyles } from "@mantine/core";
import { useBibleStore } from "../store";
import { useRef } from "react";

const useStyles = createStyles((theme) => ({
  link: {
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[2],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[2],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

const Verse = ({ verse, text }: { verse: number; text: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { classes, cx } = useStyles();
  const activeVerse = useBibleStore((state) => state.activeVerse);
  const setActiveVerse = useBibleStore((state) => state.setActiveVerse);
  setTimeout(() => {
    ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 1000);
  return (
    <Box
      component="div"
      display="flex"
      className={cx(classes.link, {
        [classes.linkActive]: activeVerse === verse,
      })}
      py={7}
      px={10}
      onClick={() => setActiveVerse(verse)}
      id={"verse-" + verse}
      ref={activeVerse === verse ? ref : null}
    >
      <Text fz="sm" fw="bold" mr={3}>
        {verse}
      </Text>
      <Title order={3} weight={400} title={"passage-verse-" + verse}>
        {text}
      </Title>
    </Box>
  );
};

export default Verse;
