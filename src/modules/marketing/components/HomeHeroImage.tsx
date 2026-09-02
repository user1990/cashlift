"use client";

import Image from "next/image";
import { type PointerEvent, useEffect, useRef } from "react";

const TILT_FRAME_DURATION_MS = 1;
const MAX_ROTATE_X_DEGREES = 2.5;
const MAX_ROTATE_Y_DEGREES = 3.5;
const RESET_DURATION_MS = 180;
const REST_ROTATE_X_DEGREES = 6;
const REST_TRANSFORM = "perspective(1600px) rotateX(6deg) rotateY(0deg) scale(0.92)";
const TILT_MEDIA_QUERY = "(min-width: 64rem) and (hover: hover) and (pointer: fine)";
const RESET_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export const HomeHeroImage = () => {
	const cardRef = useRef<HTMLElement>(null);
	const pointerFrameRef = useRef<number | null>(null);
	const resetAnimationRef = useRef<Animation | null>(null);
	const tiltAnimationRef = useRef<Animation | null>(null);

	useEffect(() => {
		if (typeof window.matchMedia !== "function") {
			return;
		}

		const mediaQueries = [window.matchMedia(TILT_MEDIA_QUERY), window.matchMedia("(prefers-reduced-motion: reduce)")];
		const clearTiltWhenUnavailable = () => {
			const card = cardRef.current;
			if (!card || canTilt()) {
				return;
			}

			cancelPointerFrame(pointerFrameRef);
			clearTilt(card, tiltAnimationRef, resetAnimationRef);
		};

		for (const mediaQuery of mediaQueries) {
			mediaQuery.addEventListener("change", clearTiltWhenUnavailable);
		}

		return () => {
			for (const mediaQuery of mediaQueries) {
				mediaQuery.removeEventListener("change", clearTiltWhenUnavailable);
			}

			cancelPointerFrame(pointerFrameRef);
			clearTilt(cardRef.current, tiltAnimationRef, resetAnimationRef);
		};
	}, []);

	const tiltOnPointerMove = (event: PointerEvent<HTMLElement>) => {
		const card = event.currentTarget;

		if (event.pointerType !== "mouse" || !canTilt()) {
			cancelPointerFrame(pointerFrameRef);
			clearTilt(card, tiltAnimationRef, resetAnimationRef);
			return;
		}

		const { clientX, clientY } = event;

		cancelPointerFrame(pointerFrameRef);

		pointerFrameRef.current = requestAnimationFrame(() => {
			pointerFrameRef.current = null;

			if (!canTilt()) {
				clearTilt(card, tiltAnimationRef, resetAnimationRef);
				return;
			}

			resetAnimationRef.current?.cancel();
			resetAnimationRef.current = null;
			card.classList.add("will-change-transform");

			const animation = tiltAnimationRef.current ?? createTiltAnimation(card, tiltAnimationRef);
			const effect = animation.effect;
			if (effect instanceof KeyframeEffect) {
				effect.setKeyframes(getInstantKeyframes(getTiltTransform(card, clientX, clientY)));
			}
			animation.currentTime = TILT_FRAME_DURATION_MS;
		});
	};

	const resetTilt = (event: PointerEvent<HTMLElement>) => {
		cancelPointerFrame(pointerFrameRef);
		const card = event.currentTarget;

		if (!canTilt()) {
			clearTilt(card, tiltAnimationRef, resetAnimationRef);
			return;
		}

		const currentTransform = getComputedStyle(card).transform;
		tiltAnimationRef.current?.cancel();
		tiltAnimationRef.current = null;
		resetAnimationRef.current?.cancel();
		card.classList.add("will-change-transform");

		const animation = card.animate(
			[{ transform: currentTransform === "none" ? REST_TRANSFORM : currentTransform }, { transform: REST_TRANSFORM }],
			{
				duration: RESET_DURATION_MS,
				easing: RESET_EASING,
				fill: "forwards",
			},
		);

		resetAnimationRef.current = animation;
		animation.onfinish = () => {
			if (resetAnimationRef.current === animation) {
				animation.cancel();
				resetAnimationRef.current = null;
				card.classList.remove("will-change-transform");
			}
		};
	};

	return (
		<figure
			ref={cardRef}
			onPointerCancel={resetTilt}
			onPointerLeave={resetTilt}
			onPointerMove={tiltOnPointerMove}
			className="relative origin-center lg:[transform-style:preserve-3d] lg:[transform:perspective(100rem)_rotateX(6deg)_scale(.92)]"
		>
			<div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-panel/35 p-1.5 shadow-shell backdrop-blur-xl sm:p-2 motion-reduce:lg:transform-none lg:[transform:translateZ(1rem)]">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_34%),radial-gradient(circle_at_84%_82%,color-mix(in_srgb,var(--highlight)_12%,transparent),transparent_32%)]"
				/>

				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-linear-to-r from-transparent via-white/50 to-transparent"
				/>

				<div className="relative overflow-hidden rounded-xl border border-primary/20 bg-shell shadow-panel">
					<Image
						alt="Studio Nova workspace with ranked cash actions, a 13-week cash outlook, and team budgets"
						src="/marketing/studio-nova-workspace-glass.webp"
						decoding="sync"
						fetchPriority="high"
						priority
						width={1568}
						height={980}
						sizes="(min-width: 1180px) 1120px, calc(100vw - 2rem)"
						className="h-auto w-full"
					/>

					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--primary)_32%,transparent)]"
					/>
				</div>
			</div>
		</figure>
	);
};

function createTiltAnimation(card: HTMLElement, animationRef: { current: Animation | null }) {
	const animation = card.animate(getInstantKeyframes(REST_TRANSFORM), {
		duration: TILT_FRAME_DURATION_MS,
		fill: "forwards",
	});

	animationRef.current = animation;

	return animation;
}

function getInstantKeyframes(transform: string) {
	return [{ transform }, { transform }];
}

function cancelPointerFrame(pointerFrameRef: { current: number | null }) {
	if (pointerFrameRef.current !== null) {
		cancelAnimationFrame(pointerFrameRef.current);
		pointerFrameRef.current = null;
	}
}

function clearTilt(
	card: HTMLElement | null,
	tiltAnimationRef: { current: Animation | null },
	resetAnimationRef: { current: Animation | null },
) {
	tiltAnimationRef.current?.cancel();
	tiltAnimationRef.current = null;
	resetAnimationRef.current?.cancel();
	resetAnimationRef.current = null;
	card?.classList.remove("will-change-transform");
}

function canTilt() {
	return (
		typeof window.matchMedia === "function" &&
		window.matchMedia(TILT_MEDIA_QUERY).matches &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

function getTiltTransform(card: HTMLElement, clientX: number, clientY: number) {
	const bounds = card.getBoundingClientRect();
	const horizontalPosition = ((clientX - bounds.left) / bounds.width) * 2 - 1;
	const verticalPosition = ((clientY - bounds.top) / bounds.height) * 2 - 1;
	const rotateX = REST_ROTATE_X_DEGREES - verticalPosition * MAX_ROTATE_X_DEGREES;
	const rotateY = horizontalPosition * MAX_ROTATE_Y_DEGREES;

	return `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.94)`;
}
