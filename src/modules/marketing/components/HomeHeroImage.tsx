"use client";

import Image from "next/image";
import { type PointerEvent, useEffect, useRef } from "react";

const FOLLOW_DURATION_MS = 1_500;
const MAX_ROTATE_X_DEGREES = 2.5;
const MAX_ROTATE_Y_DEGREES = 3.5;
const REST_ROTATE_X_DEGREES = 6;
const REST_TRANSFORM = "perspective(1600px) rotateX(6deg) rotateY(0deg) scale(0.92)";
const TILT_MEDIA_QUERY = "(min-width: 64rem) and (hover: hover) and (pointer: fine)";
const TILT_EASING = "cubic-bezier(0.03, 0.98, 0.52, 0.99)";

export const HomeHeroImage = () => {
	const animationRef = useRef<Animation | null>(null);
	const cardRef = useRef<HTMLElement>(null);
	const pointerFrameRef = useRef<number | null>(null);

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
			clearTilt(card, animationRef);
		};

		for (const mediaQuery of mediaQueries) {
			mediaQuery.addEventListener("change", clearTiltWhenUnavailable);
		}

		return () => {
			for (const mediaQuery of mediaQueries) {
				mediaQuery.removeEventListener("change", clearTiltWhenUnavailable);
			}
		};
	}, []);

	const tiltOnPointerMove = (event: PointerEvent<HTMLElement>) => {
		if (event.pointerType !== "mouse" || !canTilt()) {
			cancelPointerFrame(pointerFrameRef);
			clearTilt(event.currentTarget, animationRef);
			return;
		}

		const card = event.currentTarget;
		const { clientX, clientY } = event;

		cancelPointerFrame(pointerFrameRef);

		pointerFrameRef.current = requestAnimationFrame(() => {
			pointerFrameRef.current = null;
			animateCard(card, getTiltTransform(card, clientX, clientY), animationRef);
		});
	};

	const resetTilt = (event: PointerEvent<HTMLElement>) => {
		cancelPointerFrame(pointerFrameRef);

		if (animationRef.current) {
			animateCard(event.currentTarget, REST_TRANSFORM, animationRef, true);
			return;
		}

		event.currentTarget.classList.remove("will-change-transform");
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

function animateCard(
	card: HTMLElement,
	targetTransform: string,
	animationRef: { current: Animation | null },
	reset = false,
) {
	const currentTransform = getComputedStyle(card).transform;
	animationRef.current?.cancel();
	card.classList.add("will-change-transform");

	const animation = card.animate(
		[{ transform: currentTransform === "none" ? REST_TRANSFORM : currentTransform }, { transform: targetTransform }],
		{
			duration: FOLLOW_DURATION_MS,
			easing: TILT_EASING,
			fill: "forwards",
		},
	);

	animationRef.current = animation;

	if (reset) {
		animation.onfinish = () => {
			if (animationRef.current === animation) {
				animation.cancel();
				animationRef.current = null;
				card.classList.remove("will-change-transform");
			}
		};
	}
}

function cancelPointerFrame(pointerFrameRef: { current: number | null }) {
	if (pointerFrameRef.current !== null) {
		cancelAnimationFrame(pointerFrameRef.current);
		pointerFrameRef.current = null;
	}
}

function clearTilt(card: HTMLElement, animationRef: { current: Animation | null }) {
	animationRef.current?.cancel();
	animationRef.current = null;
	card.classList.remove("will-change-transform");
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
