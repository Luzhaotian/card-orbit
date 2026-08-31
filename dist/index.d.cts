import * as react from 'react';
import { CSSProperties } from 'react';

type CardOrbitProps = {
    /** Image URLs to place on the path (order = phase offset). */
    images: string[];
    /** Optional alt text per image; falls back to `Card ${i + 1}`. */
    alts?: string[];
    className?: string;
    style?: CSSProperties;
    stageClassName?: string;
    cardClassName?: string;
    imageClassName?: string;
    /** Auto-advance rate when not dragging. Default `45e-6`. */
    autoSpeed?: number;
    /** Pointer scrub sensitivity. Default `8e-4`. */
    dragSensitivity?: number;
    /** Visible phase window in `(0, 1)`. Default `0.72`. */
    activeWindow?: number;
    /** CSS perspective in px. Default `3400`. */
    perspective?: number;
    ariaLabel?: string;
    /**
     * Hide below `lg` (1024px) with built-in CSS.
     * Pair with `CardOrbitMobile` for narrow screens. Default `true`.
     */
    desktopOnly?: boolean;
};
declare function CardOrbit({ images, alts, className, style, stageClassName, cardClassName, imageClassName, autoSpeed, dragSensitivity, activeWindow, perspective, ariaLabel, desktopOnly, }: CardOrbitProps): react.JSX.Element | null;

type CardOrbitMobileProps = {
    images: string[];
    alts?: string[];
    className?: string;
    style?: CSSProperties;
    trackClassName?: string;
    cardClassName?: string;
    imageClassName?: string;
    /**
     * Hide at `lg` and up (pair with desktop `CardOrbit`).
     * Default `true`.
     */
    hideOnDesktop?: boolean;
    /** Marquee duration in seconds. Default `28`. */
    durationSec?: number;
};
declare function CardOrbitMobile({ images, alts, className, style, trackClassName, cardClassName, imageClassName, hideOnDesktop, durationSec, }: CardOrbitMobileProps): react.JSX.Element | null;

declare const F: number;
declare const G: number;
declare const DEFAULT_ACTIVE_WINDOW = 0.72;
declare const DEFAULT_AUTO_SPEED = 0.000045;
declare const DEFAULT_DRAG_SENSITIVITY = 0.0008;
declare const DEFAULT_PERSPECTIVE = 3400;
type PathPoint = {
    x: number;
    y: number;
    depth: number;
    fade: number;
    local: number;
    active: boolean;
};
declare function samplePath(local: number, active: boolean): PathPoint;
declare function cardTransformStyle(point: PathPoint): {
    zIndex: number;
    opacity: number;
    transform: string;
    pointerEvents: 'auto' | 'none';
};

type CreateOrbitOptions = {
    autoSpeed?: number;
    dragSensitivity?: number;
    onProgress: (progress: number) => void;
};
type OrbitController = {
    attach(el: HTMLElement): void;
    detach(): void;
    setOptions(partial: {
        autoSpeed?: number;
        dragSensitivity?: number;
    }): void;
    destroy(): void;
    getProgress(): number;
};
declare function createOrbit(options: CreateOrbitOptions): OrbitController;

export { CardOrbit, CardOrbitMobile, type CardOrbitMobileProps, type CardOrbitProps, type CreateOrbitOptions, DEFAULT_ACTIVE_WINDOW, DEFAULT_AUTO_SPEED, DEFAULT_DRAG_SENSITIVITY, DEFAULT_PERSPECTIVE, F, G, type OrbitController, type PathPoint, cardTransformStyle, createOrbit, samplePath };
