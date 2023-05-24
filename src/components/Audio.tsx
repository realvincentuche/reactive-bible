import { useState, useEffect } from "react";
import { Howl } from "howler";
import { useBibleStore } from "../store";
import { getBooks } from "../api";
import { ActionIcon, rem } from "@mantine/core";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";

const Audio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<Howl | null>(null);
  const activeBook = useBibleStore((state) => state.activeBook);
  const activeChapter = useBibleStore((state) => state.activeChapter);

  useEffect(() => {
    if (isPlaying) {
      if (audio !== null) audio.stop();
      const index = getBooks().findIndex(
        (book) => book.book_name === activeBook
      );
      const audioHowl = new Howl({
        src: [
          `https://wordpocket.org/bibles/app/audio/1/${
            index + 1
          }/${activeChapter}.mp3`,
        ],
        html5: true,
        pool: 1,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });
      setAudio(audioHowl);
      audioHowl.play();
    } else audio?.stop();

    return () => {
      audio?.unload();
    };
  }, [activeBook, activeChapter, isPlaying]);

  return (
    <ActionIcon
      variant="transparent"
      onClick={() => setIsPlaying((value) => !value)}
    >
      {isPlaying ? (
        <IconPlayerStop size={rem(20)} />
      ) : (
        <IconPlayerPlay size={rem(20)} />
      )}
    </ActionIcon>
  );
};

export default Audio;
