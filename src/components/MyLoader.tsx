import { Loader, useMantineTheme } from '@mantine/core'

const MyLoader = () => {
    const theme = useMantineTheme();
  return (
    <Loader variant="dots"color={theme.colorScheme === "dark"
    ? theme.colors.gray[0]
    : theme.colors.dark[8]} />
  )
}

export default MyLoader