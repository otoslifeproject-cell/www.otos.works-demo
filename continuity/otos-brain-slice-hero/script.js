/**
 * OTOS Brain Slice — scene sequencing
 * Durations (ms) must stay aligned with --dur-* in styles.css
 */
(function () {
  const app = document.getElementById("app");
  if (!app) return;

  const DUR_MS = {
    base: 2200,
    approach: 2700,
    rotate: 3200,
    gap: 1850,
    install: 2350,
    layer: 1250,
    /** Hold resolved state: pulses, crackle, sheen need time */
    complete: 7800,
    outro: 2500,
  };

  const PHASES = [
    "base",
    "approach",
    "rotate",
    "gap",
    "install",
    "layer",
    "complete",
    "outro",
  ];

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function raf2() {
    return new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(resolve);
      });
    });
  }

  function setPhase(phase) {
    app.dataset.phase = phase;
  }

  async function runLoop() {
    for (;;) {
      for (let i = 0; i < PHASES.length; i++) {
        const phase = PHASES[i];
        setPhase(phase);

        if (phase === "outro") {
          await wait(DUR_MS.outro);
          app.classList.add("loop-snap");
          setPhase("base");
          await raf2();
          app.classList.remove("loop-snap");
          continue;
        }

        await wait(DUR_MS[phase]);
      }
    }
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setPhase("complete");
    document.body.classList.add("otos-brain-static");
    return;
  }

  runLoop().catch(function () {});
})();
