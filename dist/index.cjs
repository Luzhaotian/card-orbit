"use client";
'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

// src/react/CardOrbit.tsx

// src/core/path.ts
var RISE = 280;
var ARC = Math.PI / 2 * 90;
var EXIT = 240;
var PATH_LEN = RISE + ARC + EXIT;
var F = RISE / PATH_LEN;
var G = (RISE + ARC) / PATH_LEN;
var DEFAULT_ACTIVE_WINDOW = 0.72;
var DEFAULT_AUTO_SPEED = 45e-6;
var DEFAULT_DRAG_SENSITIVITY = 8e-4;
var DEFAULT_PERSPECTIVE = 3400;
function samplePath(local, active) {
  const fade = active ? Math.min(
    Math.min(1, Math.max(0, local / 0.06)),
    Math.min(1, Math.max(0, (1 - local) / 0.08))
  ) : 0;
  const depth = active ? Math.sin(
    (local < F ? local / (2 * F) : 0.5 + (local - F) / (2 * (1 - F))) * Math.PI
  ) : 0;
  let x;
  let y;
  if (local < F) {
    x = -10;
    y = -300 + local / F * RISE;
  } else if (local < G) {
    const ang = (180 + (local - F) / (G - F) * 90) * (Math.PI / 180);
    x = 80 + 90 * Math.cos(ang);
    y = -20 - 90 * Math.sin(ang);
  } else {
    x = 80 + (local - G) / (1 - G) * EXIT;
    y = 70;
  }
  return { x, y, depth, fade, local, active };
}
function cardTransformStyle(point) {
  const { x, y, depth, fade, local, active } = point;
  return {
    zIndex: Math.round(20 + 80 * depth),
    opacity: active ? fade * (0.4 + 0.6 * depth) : 0,
    transform: [
      `translate3d(calc(-50% + ${x}%), calc(-50% + ${y}%), ${ -1e3 + 1280 * depth}px)`,
      `rotateX(${4 - 2 * depth}deg)`,
      `rotateY(${ -3 + 6 * local}deg)`,
      "rotateZ(0deg)",
      `scale(${0.44 + 0.74 * depth})`
    ].join(" "),
    pointerEvents: depth > 0.72 ? "auto" : "none"
  };
}

// src/core/createOrbit.ts
function createOrbit(options) {
  let autoSpeed = options.autoSpeed ?? DEFAULT_AUTO_SPEED;
  let dragSensitivity = options.dragSensitivity ?? DEFAULT_DRAG_SENSITIVITY;
  const onProgress = options.onProgress;
  let progress = 0;
  let dragging = false;
  let lastX = null;
  let lastY = null;
  let frame = 0;
  let last = 0;
  let el = null;
  let running = false;
  const emit = () => onProgress(progress);
  const onPointerDown = (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    dragging = true;
    el?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging || lastX === null || lastY === null) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const delta = dy + 0.25 * dx;
    progress = (progress + dragSensitivity * delta + 1) % 1;
    emit();
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const endDrag = (e) => {
    lastX = null;
    lastY = null;
    dragging = false;
    if (el?.hasPointerCapture?.(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
  };
  const tick = (now) => {
    const dt = now - last;
    last = now;
    if (!dragging) {
      progress = (progress + autoSpeed * dt) % 1;
      emit();
    }
    frame = requestAnimationFrame(tick);
  };
  const startLoop = () => {
    if (running) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };
  const stopLoop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const detach = () => {
    if (!el) return;
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerup", endDrag);
    el.removeEventListener("pointercancel", endDrag);
    el.removeEventListener("lostpointercapture", endDrag);
    el = null;
  };
  return {
    attach(target) {
      detach();
      el = target;
      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", endDrag);
      el.addEventListener("pointercancel", endDrag);
      el.addEventListener("lostpointercapture", endDrag);
      startLoop();
    },
    detach,
    setOptions(partial) {
      if (partial.autoSpeed !== void 0) autoSpeed = partial.autoSpeed;
      if (partial.dragSensitivity !== void 0) {
        dragSensitivity = partial.dragSensitivity;
      }
    },
    destroy() {
      stopLoop();
      detach();
      dragging = false;
      lastX = null;
      lastY = null;
    },
    getProgress() {
      return progress;
    }
  };
}
function CardOrbit({
  images,
  alts,
  className,
  style,
  stageClassName,
  cardClassName,
  imageClassName,
  autoSpeed = DEFAULT_AUTO_SPEED,
  dragSensitivity = DEFAULT_DRAG_SENSITIVITY,
  activeWindow = DEFAULT_ACTIVE_WINDOW,
  perspective = DEFAULT_PERSPECTIVE,
  ariaLabel = "Card orbit carousel",
  desktopOnly = true
}) {
  const [progress, setProgress] = react.useState(0);
  const rootRef = react.useRef(null);
  const orbitRef = react.useRef(null);
  const hasImages = images.length > 0;
  react.useEffect(() => {
    if (!hasImages) return;
    const node = rootRef.current;
    if (!node) return;
    const orbit = createOrbit({
      onProgress: setProgress
    });
    orbitRef.current = orbit;
    orbit.attach(node);
    return () => {
      orbit.destroy();
      orbitRef.current = null;
    };
  }, [hasImages]);
  react.useEffect(() => {
    orbitRef.current?.setOptions({ autoSpeed, dragSensitivity });
  }, [autoSpeed, dragSensitivity]);
  if (!hasImages) return null;
  const rootClass = [
    "card-orbit",
    desktopOnly ? "card-orbit--desktop-only" : "",
    className ?? ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref: rootRef,
      className: rootClass,
      style: { perspective: `${perspective}px`, ...style },
      "aria-label": ariaLabel,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          className: ["card-orbit__stage", stageClassName].filter(Boolean).join(" "),
          children: images.map((src, index) => {
            const phase = (index / images.length + progress) % 1;
            const active = phase > 0 && phase < activeWindow;
            const local = active ? phase / activeWindow : 0;
            const point = samplePath(local, active);
            return /* @__PURE__ */ jsxRuntime.jsx(
              "figure",
              {
                className: ["card-orbit__card", cardClassName].filter(Boolean).join(" "),
                style: cardTransformStyle(point),
                children: /* @__PURE__ */ jsxRuntime.jsx(
                  "img",
                  {
                    src,
                    alt: alts?.[index] ?? `Card ${index + 1}`,
                    width: 1200,
                    height: 780,
                    className: ["card-orbit__image", imageClassName].filter(Boolean).join(" "),
                    draggable: false,
                    decoding: "async"
                  }
                )
              },
              `${src}-${index}`
            );
          })
        }
      )
    }
  );
}
function CardOrbitMobile({
  images,
  alts,
  className,
  style,
  trackClassName,
  cardClassName,
  imageClassName,
  hideOnDesktop = true,
  durationSec = 28
}) {
  if (images.length === 0) return null;
  const loop = [...images, ...images];
  const rootClass = [
    "card-orbit-mobile",
    hideOnDesktop ? "card-orbit-mobile--desktop-hide" : "",
    className ?? ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: rootClass, style, children: /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: ["card-orbit-mobile__track", trackClassName].filter(Boolean).join(" "),
      style: { animationDuration: `${durationSec}s` },
      children: loop.map((src, i) => /* @__PURE__ */ jsxRuntime.jsx(
        "figure",
        {
          className: ["card-orbit-mobile__card", cardClassName].filter(Boolean).join(" "),
          children: /* @__PURE__ */ jsxRuntime.jsx(
            "img",
            {
              src,
              alt: alts?.[i % images.length] ?? "",
              className: ["card-orbit-mobile__image", imageClassName].filter(Boolean).join(" "),
              draggable: false
            }
          )
        },
        `${src}-${i}`
      ))
    }
  ) });
}

exports.CardOrbit = CardOrbit;
exports.CardOrbitMobile = CardOrbitMobile;
exports.DEFAULT_ACTIVE_WINDOW = DEFAULT_ACTIVE_WINDOW;
exports.DEFAULT_AUTO_SPEED = DEFAULT_AUTO_SPEED;
exports.DEFAULT_DRAG_SENSITIVITY = DEFAULT_DRAG_SENSITIVITY;
exports.DEFAULT_PERSPECTIVE = DEFAULT_PERSPECTIVE;
exports.F = F;
exports.G = G;
exports.cardTransformStyle = cardTransformStyle;
exports.createOrbit = createOrbit;
exports.samplePath = samplePath;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map