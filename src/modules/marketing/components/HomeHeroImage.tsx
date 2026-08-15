"use client";

import Image from "next/image";
import { type PointerEvent, useRef } from "react";

const FOLLOW_DURATION_MS = 1_500;
const MAX_ROTATE_X_DEGREES = 2.5;
const MAX_ROTATE_Y_DEGREES = 3.5;
const REST_ROTATE_X_DEGREES = 6;
const REST_TRANSFORM = "perspective(1600px) rotateX(6deg) rotateY(0deg) scale(0.92)";
const TILT_EASING = "cubic-bezier(0.03, 0.98, 0.52, 0.99)";

export const HomeHeroImage = () => {
	const animationRef = useRef<Animation | null>(null);
	const pointerFrameRef = useRef<number | null>(null);

	const tiltOnPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		if (!canTilt(event)) {
			return;
		}

		const card = event.currentTarget;
		const { clientX, clientY } = event;

		if (pointerFrameRef.current !== null) {
			cancelAnimationFrame(pointerFrameRef.current);
		}

		pointerFrameRef.current = requestAnimationFrame(() => {
			pointerFrameRef.current = null;
			animateCard(card, getTiltTransform(card, clientX, clientY), animationRef);
		});
	};

	const resetTilt = (event: PointerEvent<HTMLDivElement>) => {
		if (pointerFrameRef.current !== null) {
			cancelAnimationFrame(pointerFrameRef.current);
			pointerFrameRef.current = null;
		}

		if (animationRef.current) {
			animateCard(event.currentTarget, REST_TRANSFORM, animationRef, true);
		}
	};

	return (
		<div
			onPointerCancel={resetTilt}
			onPointerLeave={resetTilt}
			onPointerMove={tiltOnPointerMove}
			className="relative origin-center will-change-transform motion-reduce:will-change-auto lg:[transform-style:preserve-3d] lg:[transform:perspective(100rem)_rotateX(6deg)_scale(.92)]"
		>
			<div className="overflow-hidden rounded-xl border border-shell-border bg-shell-elevated shadow-shell motion-reduce:lg:transform-none lg:[transform:translateZ(1rem)]">
				<div
					aria-hidden
					className="absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-primary to-transparent"
				/>

				<Image
					alt="Studio Nova overview with ranked cash actions, 13-week cash outlook, and team budget charts"
					src="/marketing/studio-nova-inbox.webp"
					decoding="sync"
					fetchPriority="high"
					priority
					width={2880}
					height={1800}
					sizes="(min-width: 1180px) 1120px, calc(100vw - 2rem)"
					className="h-auto w-full"
				/>
			</div>
		</div>
	);
};

function animateCard(
	card: HTMLDivElement,
	targetTransform: string,
	animationRef: { current: Animation | null },
	reset = false,
) {
	const currentTransform = getComputedStyle(card).transform;
	animationRef.current?.cancel();

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
			}
		};
	}
}

function canTilt(event: PointerEvent<HTMLDivElement>) {
	return (
		event.pointerType === "mouse" &&
		window.matchMedia("(min-width: 64rem) and (hover: hover) and (pointer: fine)").matches &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

function getTiltTransform(card: HTMLDivElement, clientX: number, clientY: number) {
	const bounds = card.getBoundingClientRect();
	const horizontalPosition = ((clientX - bounds.left) / bounds.width) * 2 - 1;
	const verticalPosition = ((clientY - bounds.top) / bounds.height) * 2 - 1;
	const rotateX = REST_ROTATE_X_DEGREES - verticalPosition * MAX_ROTATE_X_DEGREES;
	const rotateY = horizontalPosition * MAX_ROTATE_Y_DEGREES;

	return `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.94)`;
}
