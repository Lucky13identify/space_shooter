import React, { useEffect, useRef, useState } from "react";
import { AnimatedSprite, Container, Graphics, Sprite, Stage, Text } from "@pixi/react";
import { Enemy, EnemyId } from "./types/types";
import { textStyleScore, textStyleStart, textStyleTime, textStyleWin } from "./styles/common";
import { IMG, asteroidsArray, bossData, explosion, mp3 } from "./utils/enemyData";
import { isBulletEnemyClash, isBulletBulletClash } from "./utils/clash";
import {
  basicSettings,
  shipSettings,
  bulletSettings,
  messages,
  Filter,
} from "./utils/gameSettings";
import { grapicDraw, handlersMouse } from "./utils/grapic";

import { useSounds } from "./utils/sounds";

function App() {
  const {
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
  } = useSounds();

  const [spaceX, setSpaceX] = useState<number>(basicSettings.positionSpaceX);
  const [shipX, setShipX] = useState<number>(
    (basicSettings.widthCanvas - shipSettings.widthShip) / 2
  );
  const [enemySize, setEnemySize] = useState<Enemy>(basicSettings.enemySize);

  const [isBullet, setIsBullet] = useState(false);
  const [bulletX, setBulletX] = useState<number>(shipX);
  const [bulletY, setBulletY] = useState<number>(bulletSettings.bulletY);
  const [bulletCount, setBulletCount] = useState<number>(bulletSettings.bulletCount);

  const [asteroids, setAsteroids] = useState<EnemyId[]>(asteroidsArray);
  const [score, setScore] = useState<number>(0);
  const [limitScore, setLimitScore] = useState<number>(basicSettings.limitScore);

  const [time, setTime] = useState(basicSettings.levelTime);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);
  const [isLose, setIsLose] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [isLevelBoss, setIsLevelBoss] = useState(false);
  const [isBulletEnemy, setIsBulletEnemy] = useState(false);
  const [bulletEnemyX, setBulletEnemyX] = useState<number>(bulletSettings.bulletEnemyX);
  const [bulletEnemyY, setBulletEnemyY] = useState<number>(bulletSettings.bulletEnemyY);

  const [isBulletHit, setIsBulletHit] = useState(false);
  const [bulletHitX, setBulletHitX] = useState(-100);
  const [bulletHitY, setBulletHitY] = useState(-100);

  let animationFrameId: number | null = null;
  let bulletAnimationFrameId: number | null = null;
  let bulletEnemyFrameId: number | null = null;

  let direction = 0;

  const shipXRef = useRef<number>((basicSettings.widthCanvas - shipSettings.widthShip) / 2);
  const bossXRef = useRef<number>(bossData[0].x || 0);
  const bulletYRef = useRef<number>(bulletSettings.bulletY);
  const bulletEnemyYRef = useRef<number>(bulletSettings.bulletEnemyY);
  const isClashRef = useRef<boolean>(false);
  const lastShootTimeRef = useRef<number>(0);

  const moveShip = () => {
    const newShipX = shipXRef.current + direction * shipSettings.stepMoveShip;

    if (newShipX >= 0 && newShipX + shipSettings.widthShip <= basicSettings.widthCanvas) {
      shipXRef.current = newShipX;
      setShipX((prev) => prev + direction * shipSettings.stepMoveShip);
      setSpaceX((prev) => prev - direction * basicSettings.stepMoveSpace);
      if (!isLevelBoss) {
        setAsteroids((prev) =>
          prev.map((asteroid) => ({
            ...asteroid,
            x: asteroid.x - (direction * basicSettings.stepMoveSpace) / 2,
          }))
        );
      }
    }
    animationFrameId = requestAnimationFrame(moveShip);
  };

  const moveBulletEnemy = () => {
    bulletEnemyYRef.current += basicSettings.stepMoveBullet;
    setBulletEnemyY(bulletEnemyYRef.current);

    if (bulletEnemyYRef.current < basicSettings.heightCanvas) {
      bulletEnemyFrameId = requestAnimationFrame(moveBulletEnemy);
    } else {
      bulletEnemyFrameId && cancelAnimationFrame(bulletEnemyFrameId);
      bulletEnemyFrameId = null;
      setIsBulletEnemy(false);
      setBulletEnemyY(bulletSettings.bulletEnemyY);
      bulletEnemyYRef.current = bulletSettings.bulletEnemyY;
    }
  };

  const moveBullet = () => {
    bulletYRef.current -= basicSettings.stepMoveBullet;
    setBulletY(bulletYRef.current);

    let collisionId = isBulletEnemyClash(
      asteroids,
      bulletX,
      bulletYRef.current,
      isLevelBoss,
      bossXRef.current
    );

    if (collisionId >= 0 && bulletAnimationFrameId) {
      if (!isLevelBoss) {
        setBulletHitX(bulletX);
        setBulletHitY(bulletYRef.current);
        setIsBulletHit(true);

        setTimeout(() => {
          setIsBulletHit(false);
        }, 500);
      }

      if (isLevelBoss && asteroids[0].health && asteroids[0].health > 1) {
        playBoom();
        setAsteroids((prev) =>
          prev.map((asteroid) => ({
            ...asteroid,
            health: asteroid.health && !isClashRef.current ? asteroid.health - 1 : asteroid.health,
          }))
        );
        if (isClashRef.current) bulletYRef.current = bulletSettings.bulletY;
      } else if (!isClashRef.current) {
        const updatedAsteroids = asteroids.filter((asteroid) => asteroid.id !== collisionId);
        setAsteroids(updatedAsteroids);
      }
      playBoom();
      setBulletCount((prev) => prev - 1);
      setScore((prev) => prev + 1);
      setIsBullet(false);
      setBulletY(bulletSettings.bulletY);
      bulletYRef.current = bulletSettings.bulletY;
    } else if (bulletYRef.current <= 0 && bulletAnimationFrameId) {
      setIsBullet(false);
      setBulletY(bulletSettings.bulletY);
      setBulletCount((prev) => prev - 1);
    } else {
      bulletAnimationFrameId = requestAnimationFrame(moveBullet);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isGameRunning || bulletCount <= 0) return;
    const currentTime = Date.now();

    if (e.key === "ArrowLeft") {
      direction = -1;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(moveShip);
      }
    } else if (e.key === "ArrowRight") {
      direction = 1;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(moveShip);
      }
    } else if (
      e.key === " " &&
      !isBullet &&
      currentTime - lastShootTimeRef.current >= basicSettings.timeoutBetweenShoot
    ) {
      isClashRef.current = false;
      setIsBullet(true);
      lastShootTimeRef.current = currentTime;
    }
  };

  const handleKeyUp = () => {
    direction = 0;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const handleStartClick = () => {
    setIsLevelBoss(false);
    setEnemySize(basicSettings.enemySize);
    setScore(0);
    setBulletCount(bulletSettings.bulletCount);
    setTime(basicSettings.levelTime);
    setShipX((basicSettings.widthCanvas - shipSettings.widthShip) / 2);
    setIsLose(false);
    setIsWin(false);
    setAsteroids(asteroidsArray);
    setIsGameRunning(true);
    playLevel1();
    setSpaceX(basicSettings.positionSpaceX);
    setIsLevel2(false);
    shipXRef.current = (basicSettings.widthCanvas - shipSettings.widthShip) / 2;
  };

  useEffect(() => {
    let bulletTopObj = { x: bulletEnemyX, y: bulletEnemyYRef.current, width: 26 };
    let bulletBottomObj = { x: bulletX, y: bulletYRef.current, width: 26 };
    let shipObj = {
      x: shipXRef.current + 30,
      y: basicSettings.heightCanvas - (shipSettings.heightShip - bulletSettings.bulletEnemyX),
      width: 50,
    };

    if (isLevelBoss && isBulletEnemy && isBullet) {
      let isContactBullets = isBulletBulletClash(bulletBottomObj, bulletTopObj);
      if (isContactBullets) {
        setBulletHitX(bulletX);
        setBulletHitY(bulletYRef.current);
        setIsBulletHit(true);
        setTimeout(() => {
          setIsBulletHit(false);
        }, 500);
        playBoom();
        isClashRef.current = true;
        setIsBullet(false);
        setIsBulletEnemy(false);
        bulletBottomObj = bulletSettings.initialPosition;
        bulletTopObj = bulletSettings.initialPosition;
      } else {
        isClashRef.current = false;
      }
    } else if (isLevelBoss && isBulletEnemy && !isClashRef.current) {
      let isHitInShip = isBulletBulletClash(shipObj, bulletTopObj);
      if (isHitInShip) {
        setIsBulletEnemy(false);
        setIsGameRunning(false);
        stopLevel1();
        stopLevel2();
        playLose();
        setIsLose(true);
        shipXRef.current = (basicSettings.widthCanvas - shipSettings.widthShip) / 2;
      }
    }
  }, [
    isClashRef.current,
    isLevelBoss,
    isBulletEnemy,
    isBullet,
    bulletX,
    bulletEnemyX,
    bulletYRef.current,
    shipXRef.current,
    bulletEnemyYRef.current,
  ]);

  useEffect(() => {
    if (isLevelBoss && isGameRunning && asteroids.length) {
      let intervalId = setInterval(() => {
        playEnemyShoot();
        setBulletEnemyX(asteroids[0].x + enemySize.x / 2);
        setIsBulletEnemy(true);
        isClashRef.current = false;
        moveBulletEnemy();
      }, basicSettings.intervalShoot);

      return () => clearInterval(intervalId);
    }
  }, [asteroids, enemySize.x, isGameRunning, isLevelBoss]);

  useEffect(() => {
    if (isLevelBoss && isGameRunning && asteroids.length) {
      const intervalId = setInterval(() => {
        setAsteroids((prevAsteroids) =>
          prevAsteroids.map((asteroid) => {
            const newX = Math.floor(
              Math.random() * (basicSettings.widthCanvas - basicSettings.bossSize.x)
            );
            bossXRef.current = newX;
            return { ...asteroid, x: newX };
          })
        );
      }, basicSettings.intervalPosition);

      return () => clearInterval(intervalId);
    }
  }, [isLevelBoss, asteroids, isGameRunning]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGameRunning]);

  useEffect(() => {
    if (!isBullet) {
      setBulletX(shipX + shipSettings.widthShip / 2);
    }
  }, [shipX, isBullet, shipSettings.widthShip]);

  useEffect(() => {
    if (isBullet) {
      playShoot();
      bulletYRef.current = bulletSettings.bulletY;
      bulletAnimationFrameId = requestAnimationFrame(moveBullet);
    }
  }, [isBullet]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameRunning && time > 0) {
      timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    } else if (time <= 0) {
      setIsGameRunning(false);
      setIsLose(true);
      stopLevel1();
      stopLevel2();
      playLose();
    }
    return () => clearInterval(timer);
  }, [isGameRunning, time, isLose]);

  useEffect(() => {
    if ((bulletCount <= 0 && asteroids.length > 0) || (time <= 0 && asteroids.length > 0)) {
      setIsGameRunning(false);
      setIsLose(true);
      stopLevel2();
      stopLevel1();
      playLose();
    } else if (bulletCount >= 0 && time >= 0 && asteroids.length === 0 && !isLevelBoss) {
      setIsGameRunning(false);
      setIsWin(true);
      setIsLevelBoss(true);
      stopLevel1();
      playSwichLevel();

      setTimeout(() => {
        playLevel2();
        setIsGameRunning(true);
        setScore(0);
        setLimitScore(4);
        setBulletCount(bulletSettings.bulletCount);
        setTime(basicSettings.levelTime);
        setAsteroids(bossData);
        setShipX((basicSettings.widthCanvas - shipSettings.widthShip) / 2);
        shipXRef.current = (basicSettings.widthCanvas - shipSettings.widthShip) / 2;
        setEnemySize(basicSettings.bossSize);
        setBulletEnemyX(bossData[0].x);
        setIsLose(false);
        setIsWin(false);
        setIsLevel2(true);
      }, basicSettings.timeoutBeforeLevel);
    } else if (isLevelBoss && bulletCount >= 0 && time >= 0 && !asteroids.length && isLevel2) {
      setIsGameRunning(false);
      setIsWin(true);
      stopLevel2();
      playWin();
      if (bulletAnimationFrameId) cancelAnimationFrame(bulletAnimationFrameId);
      if (bulletEnemyFrameId) cancelAnimationFrame(bulletEnemyFrameId);
    }
  }, [
    bulletCount,
    time,
    asteroids,
    basicSettings.widthCanvas,
    shipSettings.widthShip,
    isLevelBoss,
    isGameRunning,
    bulletAnimationFrameId,
    bulletEnemyFrameId,
  ]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Stage width={basicSettings.widthCanvas} height={basicSettings.heightCanvas}>
        {IMG.galaxyFirst && IMG.galaxySecond && (
          <Sprite
            image={isLevelBoss ? IMG.galaxySecond : IMG.galaxyFirst}
            filters={[Filter]}
            x={spaceX}
            y={basicSettings.positionSpaceY}
          />
        )}

        {asteroids.map((enemy) => (
          <Container key={enemy.id} visible={isGameRunning}>
            <Sprite
              image={enemy.image}
              width={enemySize.x}
              height={enemySize.y}
              x={enemy.x}
              y={enemy.y}
              visible={isGameRunning}
            />
            <Graphics
              draw={(g) => grapicDraw.healthBar(g, enemy.x, enemy.y, enemy.health, enemy.maxHealth)}
              visible={isLevelBoss}
            />
          </Container>
        ))}
        <Sprite
          image={IMG.rocket}
          width={shipSettings.widthShip}
          height={shipSettings.heightShip}
          x={shipX}
          y={basicSettings.heightCanvas - shipSettings.heightShip}
          visible={isGameRunning}
        />
        <AnimatedSprite
          width={80}
          height={80}
          anchor={0.5}
          textures={explosion}
          loop={false}
          isPlaying={isBulletHit}
          initialFrame={0}
          animationSpeed={0.2}
          x={bulletHitX}
          y={bulletHitY}
          visible={isBulletHit}
        />

        <Graphics
          visible={isBulletEnemy}
          draw={(g) => grapicDraw.bulletEnemy(g, bulletEnemyX, bulletEnemyY)}
        />

        <Graphics draw={(g) => grapicDraw.bullet(g, bulletX, bulletY)} visible={isBullet} />
        <Text
          text={`${messages.bullets}: ${bulletCount}/${bulletSettings.bulletCount}`}
          x={20}
          y={20}
          style={textStyleScore}
          visible={isGameRunning}
        />
        <Text
          text={`${isLevelBoss ? messages.health : messages.score}: ${
            isLevelBoss ? asteroids[0]?.health : score
          }/${limitScore}`}
          x={20}
          y={50}
          style={textStyleScore}
          visible={isGameRunning}
        />

        <Text
          text={messages.win}
          x={basicSettings.widthCanvas / 2}
          anchor={0.5}
          y={basicSettings.heightCanvas / 2}
          style={textStyleWin}
          visible={!isGameRunning && !isLose && isWin && isLevel2}
        />

        <Text
          text={messages.boss}
          x={basicSettings.widthCanvas / 2}
          y={basicSettings.heightCanvas / 2}
          anchor={0.5}
          style={textStyleStart}
          visible={!isGameRunning && !isLose && isWin && isLevelBoss && !isLevel2}
        />

        <Text
          text={messages.start}
          x={basicSettings.widthCanvas / 2}
          y={basicSettings.heightCanvas / 2}
          anchor={0.5}
          style={textStyleStart}
          interactive
          mouseover={handlersMouse.handleMouseOver}
          mouseout={handlersMouse.handleMouseOut}
          pointerdown={handleStartClick}
          visible={!isGameRunning && !isLose && !isWin}
        />

        <Text
          text={messages.lose}
          x={basicSettings.widthCanvas / 2}
          y={basicSettings.heightCanvas / 2}
          anchor={0.5}
          style={textStyleTime}
          visible={!isGameRunning && isLose}
        />

        <Text
          text={messages.again}
          x={basicSettings.widthCanvas / 2}
          y={basicSettings.heightCanvas / 2 + 50}
          anchor={0.5}
          style={textStyleStart}
          interactive
          mouseover={handlersMouse.handleMouseOver}
          mouseout={handlersMouse.handleMouseOut}
          pointerdown={handleStartClick}
          visible={!isGameRunning && isLose}
        />
        <Text
          text={`${messages.time}: ${time}`}
          x={1210}
          y={35}
          anchor={0.5}
          style={textStyleTime}
          visible={isGameRunning}
        />
      </Stage>
    </div>
  );
}

export default App;
