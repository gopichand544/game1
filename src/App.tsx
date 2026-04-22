import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans text-[var(--cyan)] selection:bg-[var(--magenta)] selection:text-black">
      <div className="scanlines"></div>
      <div className="static-noise"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col h-screen">
        {/* Header Content */}
        <header className="mb-4 md:mb-8 flex justify-between items-center px-4 max-w-3xl mx-auto w-full border-b-[4px] border-b-[var(--magenta)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--cyan)] border-2 border-[var(--magenta)] flex items-center justify-center font-display text-black shadow-[2px_2px_0px_var(--magenta)]">
              !
            </div>
            <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight text-[var(--cyan)] glitch" data-text="SYS//NRV">
              SYS//NRV
            </h1>
          </div>
          <div className="text-[var(--magenta)] text-xl animate-pulse font-display">ERR_CONN</div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16 w-full mx-auto pb-10">
          {/* Game Window container */}
          <div className="flex-1 w-full max-w-2xl flex justify-center order-1 lg:order-2">
            <SnakeGame />
          </div>

          {/* Music Player container */}
          <div className="w-full lg:w-80 flex flex-col order-2 lg:order-1 pt-4 lg:pt-0">
            <div className="text-[var(--magenta)] text-2xl mb-4 border-l-4 border-[var(--cyan)] pl-2">RTR_CTRLX</div>
            <MusicPlayer />
          </div>
        </main>
      </div>
    </div>
  );
}
