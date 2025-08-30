import { Box, Text, Title, createStyles } from "@mantine/core";
import { useBibleStore } from "../store";
import { useEffect, useRef } from "react";

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
  const activeVerses = useBibleStore((state) => state.activeVerses);
  const setActiveVerses = useBibleStore((state) => state.setActiveVerses);
  const isActive = activeVerses.includes(verse);

  const handleVerseClick = () => {
    if (isActive) {
      setActiveVerses(activeVerses.filter((v) => v !== verse));
    } else {
      setActiveVerses([...activeVerses, verse]);
    }
  };

  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [isActive]);

  return (
    <Box
      component="div"
      display="flex"
      className={cx(classes.link, {
        [classes.linkActive]: isActive,
      })}
      py={7}
      px={10}
      onClick={handleVerseClick}
      id={"verse-" + verse}
      ref={isActive ? ref : null}
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
