import { Box, Navbar, ScrollArea, createStyles, rem } from "@mantine/core";
import { getBooks, getChapters, getVerses } from "../api";
import { useBibleStore } from "../store";

const useStyles = createStyles((theme) => ({
  border: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3]
    }`,
  },

  link: {
    boxSizing: "border-box",
    display: "block",
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `0 ${theme.spacing.xs}`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
    fontWeight: 500,
    height: rem(30),
    lineHeight: rem(30),

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

const MyNavbar = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) => {
  const { classes, cx } = useStyles();
  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);
  const activeVerse = useBibleStore((state) => state.activeVerse);
  const setActiveBook = useBibleStore((state) => state.setActiveBook);
  const setActiveBookShort = useBibleStore((state) => state.setActiveBookShort);
  const setActiveChapter = useBibleStore((state) => state.setActiveChapter);
  const setActiveVerse = useBibleStore((state) => state.setActiveVerse);

  return (
    <Navbar
      py="sm"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 320, lg: 320 }}
      sx={{
        overflow: "hidden",
        transition: "width 1000ms ease, min-width 1000ms ease",
      }}
    >
      <Navbar.Section style={{ display: "flex" }}>
        <Box style={{ flex: "0 0 185px" }}>
          <ScrollArea h="88vh" className={classes.border}>
            {getBooks().map((book) => (
              <a
                className={cx(classes.link, {
                  [classes.linkActive]: activeBook === book.book_name,
                })}
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  setActiveBook(book.book_name);
                  setActiveBookShort(book.book_id);
                }}
                key={book.book_id}
                title={"nav-book-" + book.book_id}
              >
                {book.book_name}
              </a>
            ))}
          </ScrollArea>
        </Box>
        <Box style={{ flex: "1 0 60px" }}>
          <ScrollArea h="88vh" className={classes.border}>
            {getChapters(activeBook).map((chapter) => (
              <a
                className={cx(classes.link, {
                  [classes.linkActive]: activeChapter === chapter,
                })}
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  setActiveChapter(chapter);
                }}
                key={chapter}
                title={"nav-chapter-" + chapter}
              >
                {chapter}
              </a>
            ))}
          </ScrollArea>
        </Box>
        <Box style={{ flex: "1 0 60px" }}>
          <ScrollArea h="88vh">
            {getVerses(activeBook, activeChapter).map((verse) => (
              <a
                className={cx(classes.link, {
                  [classes.linkActive]: activeVerse === verse,
                })}
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  setActiveVerse(verse);
                  setOpened(false);
                }}
                key={verse}
                title={"nav-verse-" + verse}
              >
                {verse}
              </a>
            ))}
          </ScrollArea>
        </Box>
      </Navbar.Section>
    </Navbar>
  );
};

export default MyNavbar;
