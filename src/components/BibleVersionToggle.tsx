import { Button, useMantineTheme } from '@mantine/core';
import { useBibleStore } from '../store';

const BibleVersionToggle = () => {
  const { bibleVersion, setBibleVersion } = useBibleStore((state) => ({
    bibleVersion: state.bibleVersion,
    setBibleVersion: state.setBibleVersion,
  }));
  const theme = useMantineTheme();

  const handleBibleVersionChange = () => {
    setBibleVersion(bibleVersion === 'KJV' ? 'ESV' : 'KJV');
  };

  return (
    <Button
      variant="outline"
      color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
      onClick={handleBibleVersionChange}
    >
      {bibleVersion === 'KJV' ? 'KJV' : 'ESV'}
    </Button>
  );
};

export default BibleVersionToggle;