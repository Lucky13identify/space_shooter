// utils/useSounds.ts
import { useSound as useSoundLibrary } from "use-sound";
import { mp3 } from "./enemyData";

export const useSounds = () => {
  const [playLevel1, { stop: stopLevel1 }] = useSoundLibrary(mp3.levelOne, { volume: 0.5 });
  const [playLevel2, { stop: stopLevel2 }] = useSoundLibrary(mp3.level2, { volume: 0.5 });
  const [playSwichLevel] = useSoundLibrary(mp3.swichLevel, { volume: 0.5 });
  const [playShoot] = useSoundLibrary(mp3.shoot, { volume: 0.7 });
  const [playBoom] = useSoundLibrary(mp3.boom, { volume: 0.7 });
  const [playEnemyShoot] = useSoundLibrary(mp3.enemyShoot, { volume: 0.7 });
  const [playLose] = useSoundLibrary(mp3.lose, { volume: 0.6 });
  const [playWin] = useSoundLibrary(mp3.win, { volume: 0.4 });

  return {
    playLevel1,
    stopLevel1,
    playLevel2,
    stopLevel2,
    playSwichLevel,
    playShoot,
    playBoom,
    playEnemyShoot,
    playLose,
    playWin,
  };
};
