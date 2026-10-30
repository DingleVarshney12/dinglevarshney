"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { AboutChapter, MascotDialogue } from "@/lib/types";
import { WorldScene } from "./scene/world-scene";
import { DirectionButton } from "./controls/direction-button";
import { cameraLimits, emptyBookPages, stops } from "./constants/world.constants";
import type { Direction, InputState, StopId } from "./types/world.type";
import type { PublicPortfolioData } from "@/api/portfolio/portfolio.type";
import { useSoundEffects } from "@/audio/sound-effects-provider";
import { SoundToggle } from "../ui/sound-toggle";
import { paginateAboutChapters } from "./utils/paginate-about-chapters";
import { StorybookPage } from "./scene/storybook-page";
import { ProjectImageGallery } from "./project-image-gallery";
import { MascotConversation } from "./ui/mascot-conversation";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Move3D,
  X,
} from "lucide-react";

export function PortfolioWorld({
  onLeave,
  data,
}: {
  onLeave: () => void;
  data: PublicPortfolioData;
}) {
  const { play: playSound } = useSoundEffects();
  const [nearbyGate, setNearbyGate] = useState<StopId | null>(null);
  const nearbyGateRef = useRef<StopId | null>(null);
  const [activeSection, setActiveSection] = useState<StopId | null>(null);
  const [bookPage, setBookPage] = useState(0);
  const [pagesPerSpread, setPagesPerSpread] = useState(2);
  const [projectIndex, setProjectIndex] = useState(0);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [templeFlowerTrigger, setTempleFlowerTrigger] = useState(0);
  const input = useRef<InputState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });
  const jumpQueued = useRef(false);
  const cameraRotation = useRef({ yaw: 0, pitch: 0.28 });
  const drag = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const pageLayout = window.matchMedia("(max-width: 639px)");
    const updatePageLayout = () => setPagesPerSpread(pageLayout.matches ? 1 : 2);
    updatePageLayout();
    pageLayout.addEventListener("change", updatePageLayout);
    return () => pageLayout.removeEventListener("change", updatePageLayout);
  }, []);

  const onViewPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event.button !== 0 ||
      (event.target instanceof Element &&
        event.target.closest(
          "button, a, input, textarea, select, [role='button'], [data-no-world-drag]",
        ))
    )
      return;
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    const pointerTarget = event.target;
    if (pointerTarget instanceof HTMLCanvasElement) {
      pointerTarget.setPointerCapture(event.pointerId);
    } else {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };
  const onViewPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    cameraRotation.current.yaw -= dx * 0.006;
    cameraRotation.current.pitch = Math.max(
      cameraLimits.minPitch,
      Math.min(cameraLimits.maxPitch, cameraRotation.current.pitch + dy * 0.005),
    );
  };
  const onViewPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  };

  const setDirection = (direction: Direction, pressed: boolean) => {
    if (direction === "jump" && pressed && !input.current.jump) jumpQueued.current = true;
    input.current[direction] = pressed;
  };

  const updateNearbyGate = (next: StopId | null) => {
    if (nearbyGateRef.current === next) return;
    nearbyGateRef.current = next;
    setNearbyGate(next);
  };

  const enterNearbyGate = () => {
    if (nearbyGateRef.current === "exit") {
      onLeave();
      return;
    }
    if (nearbyGateRef.current === "temple") {
      setTempleFlowerTrigger((trigger) => trigger + 1);
      return;
    }
    if (!nearbyGateRef.current) return;
    if (nearbyGateRef.current === "projects") setProjectIndex(0);
    setActiveSection(nearbyGateRef.current);
  };

  useEffect(() => {
    const keyDirections: Record<string, Direction> = {
      w: "forward",
      ArrowUp: "forward",
      s: "backward",
      ArrowDown: "backward",
      a: "left",
      ArrowLeft: "left",
      d: "right",
      ArrowRight: "right",
      " ": "jump",
      Spacebar: "jump",
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "BUTTON", "A"].includes(target.tagName)
      )
        return;
      if (event.key === "Enter" && !activeSection && nearbyGateRef.current) {
        event.preventDefault();
        playSound(
          nearbyGateRef.current === "exit"
            ? "exit"
            : nearbyGateRef.current === "temple"
              ? "temple"
              : "enter",
        );
        enterNearbyGate();
        return;
      }
      if (activeSection) return;
      const direction =
        keyDirections[event.key.startsWith("Arrow") ? event.key : event.key.toLowerCase()];
      if (!direction) return;
      event.preventDefault();
      setDirection(direction, true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const direction =
        keyDirections[event.key.startsWith("Arrow") ? event.key : event.key.toLowerCase()];
      if (direction) setDirection(direction, false);
    };
    const releaseAll = () => {
      for (const direction of Object.keys(input.current) as Direction[])
        input.current[direction] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", releaseAll);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseAll);
    };
  }, [activeSection, onLeave, playSound]);

  useEffect(() => {
    const footsteps = window.setInterval(() => {
      const moving =
        input.current.forward ||
        input.current.backward ||
        input.current.left ||
        input.current.right;
      if (moving && !activeSection) playSound("step");
    }, 360);
    return () => window.clearInterval(footsteps);
  }, [activeSection, playSound]);

  const nearby = nearbyGate ? stops.find((stop) => stop.id === nearbyGate) : null;
  const bookChapters: Pick<AboutChapter, "title" | "content" | "imageUrl">[] = data.aboutChapters
    .length
    ? data.aboutChapters
    : data.profile?.about
      ? [{ title: "About me", content: data.profile.about }]
      : emptyBookPages;
  const bookPages = paginateAboutChapters(bookChapters);
  const lastPageIndex = bookPages.length - 1;
  const lastSpreadStart =
    pagesPerSpread === 2 ? lastPageIndex - (lastPageIndex % 2) : lastPageIndex;
  const currentBookPage = Math.min(
    Math.floor(bookPage / pagesPerSpread) * pagesPerSpread,
    lastSpreadStart,
  );
  const nextBookPage = bookPages[currentBookPage + 1];
  const currentDialogue: MascotDialogue | undefined = data.mascotDialogues[dialogueStep];
  const currentProject = data.projects[projectIndex] ?? data.projects[0];

  const showPreviousProject = () => {
    setProjectIndex((index) => (index + data.projects.length - 1) % data.projects.length);
  };
  const showNextProject = () => {
    setProjectIndex((index) => (index + 1) % data.projects.length);
  };
  const showPreviousDialogue = () => {
    setDialogueStep((step) => Math.max(0, step - 1));
  };
  const showNextDialogue = () => {
    setDialogueStep((step) => Math.min(data.mascotDialogues.length - 1, step + 1));
  };

  return (
    <div
      role="application"
      aria-label="Interactive 3D portfolio room. Walk to a section or the exit point, then press Enter to interact. Drag to rotate the view."
      onPointerDown={onViewPointerDown}
      onPointerMove={onViewPointerMove}
      onPointerUp={onViewPointerUp}
      onPointerCancel={onViewPointerUp}
      onContextMenu={(event) => event.preventDefault()}
      className="world-frame relative isolate h-full min-h-0 w-full touch-none overflow-hidden bg-[#dfd2bb]"
    >
      <Canvas
        shadows
        dpr={[1, 1.25]}
        camera={{ position: [0, 3.2, 6.5], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        className="!absolute inset-0"
      >
        <color attach="background" args={["#dfd2bb"]} />
        <fog attach="fog" args={["#dfd2bb", 24, 48]} />
        <ambientLight intensity={1.1} />
        <directionalLight
          castShadow
          position={[-7, 12, 6]}
          intensity={2.1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight
          position={[-3.8, 7.4, -2.2]}
          color="#ffd9a1"
          intensity={18}
          distance={20}
          decay={2}
        />
        <pointLight
          position={[0.2, 3.8, -5.2]}
          color="#65d4be"
          intensity={5}
          distance={7}
          decay={2}
        />
        <hemisphereLight args={["#fff5e3", "#756553", 0.9]} />
        <WorldScene
          input={input}
          jumpQueued={jumpQueued}
          active={activeSection !== null}
          mascotTalking={activeSection === "mascot"}
          cameraRotation={cameraRotation}
          onNearbyChange={updateNearbyGate}
          socialLinks={data.profile?.socialLinks}
          templeFlowerTrigger={templeFlowerTrigger}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
        <div className="rounded-xl border border-white/15 bg-[#172b2c]/90 px-4 py-3 text-white shadow-lg">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8dd6bd]">MY LITTLE WORLD</p>
          <p className="mt-1 text-[10px] text-white/65 sm:hidden">Drag to look · arrows to move</p>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-[#172b2c]/85 px-4 py-2 text-xs font-semibold text-white/90 shadow sm:flex">
            <Move3D size={15} className="text-teal-700" /> WASD / arrows{" "}
            <span className="mx-1 text-slate-400">·</span> drag to look around{" "}
            <span className="mx-1 text-slate-400">·</span> Enter to interact
          </div>
          <SoundToggle />
        </div>
      </div>

      {nearby && !activeSection && (
        <div
          className={`absolute bottom-36 left-1/2 z-30 flex w-[min(27rem,calc(100%-1.5rem))] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border p-3 shadow-xl backdrop-blur-xl sm:bottom-5 sm:z-20 sm:w-auto sm:gap-5 sm:rounded-full sm:px-5 sm:py-3 ${nearby.id === "temple" ? "border-amber-200/80 bg-[#fff8e8]/95 text-amber-950" : "border-white/70 bg-white/95 text-slate-800"}`}
        >
          {nearby.id === "temple" ? (
            <>
              <p className="animate-in fade-in text-sm font-extrabold tracking-wide sm:text-base">
                🙏 Jai Jagannath 🙏
              </p>
              <button
                type="button"
                onClick={enterNearbyGate}
                data-sound="temple"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#8f5d20] px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#754a18]"
              >
                <kbd className="rounded bg-white/15 px-1.5 py-0.5 text-[10px]">ENTER</kbd>
                <span className="hidden sm:inline">Offer flowers</span>
                <ArrowUpRight size={14} />
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="text-[9px] font-bold tracking-[0.16em] text-teal-700">
                  {nearby.id === "exit" ? "ROOM EXIT" : "YOU FOUND"}
                </p>
                <p className="mt-0.5 text-xs font-bold sm:text-sm">{nearby.name}</p>
              </div>
              <button
                type="button"
                onClick={enterNearbyGate}
                data-sound={nearby.id === "exit" ? "exit" : "enter"}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#173b3a] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-teal-800"
              >
                <kbd className="rounded bg-white/15 px-1.5 py-0.5 text-[10px]">ENTER</kbd>
                <span className="hidden sm:inline">
                  {nearby.id === "exit" ? "Exit to home" : "Interact"}
                </span>
                <ArrowUpRight size={14} />
              </button>
            </>
          )}
        </div>
      )}

      {activeSection && (
        <div
          className={`world-overlay absolute inset-0 z-30 grid place-items-center p-4 sm:p-8 ${activeSection === "book" ? "world-overlay-book" : ""} ${activeSection === "mascot" ? "world-overlay-mascot items-end justify-items-end p-3 sm:p-6" : ""}`}
          aria-live="polite"
        >
          <button
            type="button"
            onClick={() => setActiveSection(null)}
            data-sound="exit"
            aria-label="Return to the world"
            className="absolute right-4 top-4 rounded-full bg-[#f8f6ef] p-2.5 text-slate-600 shadow-lg transition hover:bg-white sm:right-7 sm:top-7"
          >
            <X size={19} />
          </button>
          {activeSection === "book" && (
            <div className="storybook-panel w-full max-w-4xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/90">
                <BookOpen size={17} /> A little book about me
              </div>
              <div className="storybook-spread" key={currentBookPage}>
                <StorybookPage
                  page={bookPages[currentBookPage]}
                  pageNumber={currentBookPage + 1}
                  author={data.profile?.name ?? "Dingle Varshney"}
                />
                {nextBookPage && (
                  <StorybookPage
                    page={nextBookPage}
                    pageNumber={currentBookPage + 2}
                    author={data.profile?.name ?? "Dingle Varshney"}
                    right
                  />
                )}
                {!nextBookPage && (
                  <article className="storybook-page storybook-page-right">
                    <div className="grid h-full place-items-center rounded-sm border border-[#c6b991]/60 bg-[#ece6d5] p-4 text-center">
                      <div>
                        <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full border border-[#a88b57]/40 text-3xl text-[#917344]">
                          ✳
                        </div>
                        <p className="font-serif text-xl text-[#51483b]">A life in progress</p>
                        <p className="mt-2 text-xs text-[#82704f]">More pages, more stories.</p>
                      </div>
                    </div>
                    <p className="mt-3 text-right text-xs text-[#82704f]">{currentBookPage + 2}</p>
                  </article>
                )}
              </div>
              <div className="mt-5 flex items-center justify-between text-white">
                <button
                  type="button"
                  data-sound="page"
                  disabled={currentBookPage === 0}
                  onClick={() => setBookPage((page) => Math.max(0, page - pagesPerSpread))}
                  className="rounded-full border border-white/35 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-white/70">
                  {pagesPerSpread === 2 && nextBookPage
                    ? `Pages ${currentBookPage + 1}–${currentBookPage + 2} of ${bookPages.length}`
                    : `Page ${currentBookPage + 1} of ${bookPages.length}`}
                </span>
                <button
                  type="button"
                  data-sound="page"
                  disabled={currentBookPage >= lastSpreadStart}
                  onClick={() =>
                    setBookPage((page) => Math.min(lastSpreadStart, page + pagesPerSpread))
                  }
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#332b20] disabled:opacity-40"
                >
                  Turn page
                </button>
              </div>
            </div>
          )}
          {activeSection === "certificates" && (
            <article className="w-full max-w-xl rounded-2xl bg-[#f8f6ef] p-7 text-[#332b20] shadow-2xl sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#82704f]">
                ON THE WALL
              </p>
              <h2 className="mt-3 font-serif text-3xl">Milestones & certificates</h2>
              {data.certificates.length === 0 ? (
                <p className="mt-4 text-sm leading-7 text-[#62594c]">
                  I’ll add my certificates here soon.
                </p>
              ) : (
                <ul className="mt-5 grid gap-3">
                  {data.certificates.map((certificate) => (
                    <li
                      key={certificate.id}
                      className="rounded-xl border border-[#d8cfbb] bg-white/70 p-4"
                    >
                      <p className="font-semibold">{certificate.title}</p>
                      <p className="mt-1 text-sm text-[#62594c]">{certificate.issuer}</p>
                      {certificate.credentialId && (
                        <p className="mt-2 text-xs text-[#62594c]">
                          Credential ID:{" "}
                          <span className="font-mono font-semibold">
                            {certificate.credentialId}
                          </span>
                        </p>
                      )}
                      {certificate.credentialUrl && (
                        <a
                          className="mt-2 block break-all text-xs font-semibold leading-5 text-[#2a6355] underline underline-offset-2"
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={certificate.credentialUrl}
                        >
                          {certificate.credentialUrl}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setActiveSection(null)}
                className="mt-7 text-sm font-semibold text-[#2a6355]"
              >
                Back to the room
              </button>
            </article>
          )}
          {activeSection === "projects" && (
            <article className="w-full max-w-xl rounded-2xl bg-[#f8f6ef] p-7 text-[#332b20] shadow-2xl sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#82704f]">
                ON THE DESK
              </p>
              <h2 className="mt-3 font-serif text-3xl">Things I&apos;ve been making</h2>
              {data.projects.length === 0 ? (
                <p className="mt-4 text-sm leading-7 text-[#62594c]">
                  I’ll share my projects here soon.
                </p>
              ) : (
                <div className="mt-5">
                  {currentProject && (
                    <article
                      key={currentProject.id}
                      className="rounded-xl border border-[#d8cfbb] bg-white/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#82704f]">
                            {currentProject.category}
                          </p>
                          <h3 className="mt-1 font-semibold">{currentProject.title}</h3>
                        </div>
                        {currentProject.images.length > 0 && (
                          <ProjectImageGallery
                            images={currentProject.images}
                            projectTitle={currentProject.title}
                          />
                        )}
                      </div>
                      {currentProject.role && (
                        <p className="mt-1 text-xs font-medium text-[#82704f]">
                          {currentProject.role}
                          {currentProject.year ? ` · ${currentProject.year}` : ""}
                        </p>
                      )}
                      <p className="mt-1 text-sm leading-6 text-[#62594c]">
                        {currentProject.longDescription ?? currentProject.description}
                      </p>
                      <p className="mt-2 text-xs text-[#62594c]">
                        {currentProject.technologies.join(" · ")}
                      </p>
                      <div className="mt-3 flex gap-4 text-sm font-semibold text-[#2a6355]">
                        {currentProject.demoUrl && (
                          <a
                            href={currentProject.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live demo
                          </a>
                        )}
                        {currentProject.githubUrl && (
                          <a
                            href={currentProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Source
                          </a>
                        )}
                      </div>
                    </article>
                  )}
                  {data.projects.length > 1 && (
                    <nav
                      aria-label="Project slider"
                      className="mt-4 flex items-center justify-between"
                    >
                      <button
                        type="button"
                        data-sound="interact"
                        onClick={showPreviousProject}
                        aria-label="Previous project"
                        className="inline-flex items-center gap-1 rounded-full border border-[#cfc4ac] px-3 py-2 text-sm font-semibold text-[#34413d] transition hover:bg-white"
                      >
                        <ChevronLeft size={17} /> Previous
                      </button>
                      <span className="text-xs font-medium text-[#82704f]">
                        {projectIndex + 1} / {data.projects.length}
                      </span>
                      <button
                        type="button"
                        data-sound="interact"
                        onClick={showNextProject}
                        aria-label="Next project"
                        className="inline-flex items-center gap-1 rounded-full bg-[#244f45] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1c4038]"
                      >
                        Next <ChevronRight size={17} />
                      </button>
                    </nav>
                  )}
                </div>
              )}
              <button
                type="button"
                data-sound="exit"
                onClick={() => setActiveSection(null)}
                className="mt-7 text-sm font-semibold text-[#2a6355]"
              >
                Back to the room
              </button>
            </article>
          )}
          {activeSection === "mascot" && (
            <MascotConversation
              dialogue={currentDialogue}
              index={dialogueStep}
              total={data.mascotDialogues.length}
              onPrevious={showPreviousDialogue}
              onNext={showNextDialogue}
              onClose={() => setActiveSection(null)}
            />
          )}
        </div>
      )}

      {!activeSection && (
        <div
          className="absolute bottom-4 left-4 z-20 flex flex-col items-center gap-1 sm:hidden"
          aria-label="Movement controls"
        >
          <DirectionButton
            label="Move forward"
            icon={<ChevronUp size={20} />}
            onDown={() => setDirection("forward", true)}
            onUp={() => setDirection("forward", false)}
          />
          <div className="flex gap-1">
            <DirectionButton
              label="Move left"
              icon={<ChevronLeft size={20} />}
              onDown={() => setDirection("left", true)}
              onUp={() => setDirection("left", false)}
            />
            <DirectionButton
              label="Move backward"
              icon={<ChevronDown size={20} />}
              onDown={() => setDirection("backward", true)}
              onUp={() => setDirection("backward", false)}
            />
            <DirectionButton
              label="Move right"
              icon={<ChevronRight size={20} />}
              onDown={() => setDirection("right", true)}
              onUp={() => setDirection("right", false)}
            />
          </div>
        </div>
      )}
      {!activeSection && (
        <button
          type="button"
          aria-label="Hop"
          className="absolute bottom-6 right-5 z-20 rounded-full border border-white/70 bg-white/80 px-5 py-4 text-xs font-extrabold text-teal-900 shadow-lg backdrop-blur-md touch-none sm:hidden"
          onPointerDown={() => setDirection("jump", true)}
          onPointerUp={() => setDirection("jump", false)}
          onPointerLeave={() => setDirection("jump", false)}
          onPointerCancel={() => setDirection("jump", false)}
        >
          HOP
        </button>
      )}
    </div>
  );
}
