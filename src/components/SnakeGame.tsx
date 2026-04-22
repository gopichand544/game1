import React, { useState, useEffect, useCallback, useRef } from 'react';

// Grid size and dimensions
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150; // ms per tick

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Track the actual direction applied in the last tick to prevent reversing into oneself
  const lastDirectionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food doesn't spawn on the snake
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is focused on a button or input
      if (document.activeElement?.tagName === 'BUTTON' || document.activeElement?.tagName === 'INPUT') {
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && (gameOver || !isPlaying)) {
        resetGame();
        return;
      }

      if (!isPlaying || gameOver) return;

      const { x: lastX, y: lastY } = lastDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastY === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastY === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastX === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastX === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Main game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        lastDirectionRef.current = direction; // Lock the direction for this tick

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          generateFood(newSnake);
          // Don't pop the tail if we ate food
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    // calculate speed increase based on score
    const currentSpeed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);

    const intervalId = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(intervalId);
  }, [direction, food, isPlaying, gameOver, score, generateFood]);

  return (
    <div className="flex flex-col items-center flex-1 w-full max-w-2xl px-2">
      <div className="w-full max-w-[500px] flex justify-between items-end mb-6">
        <div>
          <h2 className="font-display text-xl md:text-2xl text-[var(--magenta)] tracking-widest uppercase glitch" data-text="NEON DRIFT">
            NEON DRIFT
          </h2>
          <p className="text-[var(--cyan)] text-lg mt-1 uppercase font-semibold">SYS_MATRIX</p>
        </div>
        <div className="text-right">
          <div className="text-[var(--magenta)] text-sm uppercase mb-1 font-display">SCORE</div>
          <div className="font-display font-bold text-3xl md:text-4xl leading-none text-[#fff] bg-[var(--cyan)] text-black px-2 py-1 shadow-[4px_4px_0_var(--magenta)]">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      <div className="relative p-2 glass-panel w-full aspect-square max-w-[500px]">
        {/* Game Canvas / Cells area */}
        <div 
          className="relative w-full h-full bg-[#000] border-4 border-[var(--cyan)] overflow-hidden z-10 p-[2px]"
        >
          {/* Grid overlay matching the theme */}
          <div 
            className="absolute inset-[2px] grid z-0 gap-[1px]"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div key={i} className="bg-[rgba(0,255,255,0.05)] rounded-none"></div>
            ))}
          </div>

          {/* Food */}
          <div
            className="absolute bg-[var(--magenta)] rounded-none z-10"
            style={{
              width: `calc(${100 / GRID_SIZE}% - 2px)`,
              height: `calc(${100 / GRID_SIZE}% - 2px)`,
              left: `calc(${(food.x / GRID_SIZE) * 100}% + 1px)`,
              top: `calc(${(food.y / GRID_SIZE) * 100}% + 1px)`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute rounded-none z-10 ${
                  isHead 
                    ? 'bg-[#fff] border-2 border-[var(--cyan)] z-20' 
                    : 'bg-[var(--cyan)] border border-[#000]'
                }`}
                style={{
                  width: `calc(${100 / GRID_SIZE}% - 2px)`,
                  height: `calc(${100 / GRID_SIZE}% - 2px)`,
                  left: `calc(${(segment.x / GRID_SIZE) * 100}% + 1px)`,
                  top: `calc(${(segment.y / GRID_SIZE) * 100}% + 1px)`,
                }}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.9)] rounded-none border-4 border-[var(--magenta)]">
            {gameOver ? (
              <>
                <h3 className="font-display text-2xl md:text-4xl text-[var(--magenta)] mb-4 tracking-wide glitch" data-text="FATAL_ERR">FATAL_ERR</h3>
                <p className="text-[var(--cyan)] mb-8 uppercase text-xl font-semibold bg-black px-2 border border-[var(--cyan)]">FINAL SCORE: {score}</p>
                <button
                  onClick={resetGame}
                  className="btn-retro px-6 py-4 text-sm"
                >
                  REBOOT [SPC]
                </button>
              </>
            ) : (
              <>
                <h3 className="font-display text-xl text-white mb-2 tracking-widest text-center uppercase border-b-2 border-[var(--cyan)] pb-2 mb-4">
                  UPLINK_RDY
                </h3>
                <p className="text-[var(--magenta)] text-xl uppercase mb-8 font-semibold animate-pulse">
                  &gt; CONNECT_PROTOCOL
                </p>
                <button
                  onClick={resetGame}
                  className="btn-retro px-6 py-4 text-sm flex items-center gap-2"
                >
                  START [SPC]
                </button>
                
                <div className="mt-8 flex gap-3 text-lg font-mono text-[var(--cyan)] tracking-wider uppercase">
                  <span className="flex items-center gap-1 border-2 border-[var(--magenta)] bg-black px-2 py-1">[WASD]</span>
                  <span className="flex items-center gap-1 border-2 border-[var(--magenta)] bg-black px-2 py-1">[ARROWS]</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
