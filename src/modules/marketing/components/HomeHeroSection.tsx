import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ActionLink } from "./ActionLink";

const HERO_IMAGE_BLUR_DATA_URL =
	// biome-ignore lint/security/noSecrets: Low-resolution public image placeholder, not a credential.
	"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgEG/8QAGxAAAgMBAQEAAAAAAAAAAAAAAQIAESESUQP/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/AMt8z0jWL2XjLC56IEy6iDuBQZgPLjgv/9k=";

export const HomeHeroSection = () => (
	<section className="relative isolate overflow-hidden border-b border-shell-border bg-shell">
		<div
			aria-hidden
			className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_32%),radial-gradient(circle_at_82%_36%,color-mix(in_srgb,var(--highlight)_12%,transparent),transparent_28%)]"
		/>

		<div className="relative mx-auto max-w-[1180px] px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-16 lg:pt-24">
			<header className="mx-auto max-w-4xl text-center">
				<p className="text-s+ font-semibold uppercase tracking-normal text-primary">Cash action inbox</p>

				<h1 className="mt-4 text-5xl+ tracking-normal text-primary sm:text-7xl+">
					See what to collect, approve, or cut today.
				</h1>

				<p className="mx-auto mt-6 max-w-2xl text-l leading-8 text-shell-muted">
					CashLift ranks the cash actions that matter now in one daily inbox.
				</p>

				<ActionLink href="/demo/workspace" prefetch={false} className="mt-8">
					Open live demo
					<ArrowRight aria-hidden className="size-4" />
				</ActionLink>
			</header>

			<div className="relative mt-10 overflow-hidden rounded-xl border border-shell-border bg-shell-elevated shadow-shell sm:mt-12">
				<div
					aria-hidden
					className="absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-primary to-transparent"
				/>

				<Image
					alt="Studio Nova overview with ranked cash actions, 13-week cash outlook, and team budget charts"
					blurDataURL={HERO_IMAGE_BLUR_DATA_URL}
					className="h-auto w-full"
					decoding="async"
					fetchPriority="high"
					height={1800}
					placeholder="blur"
					priority
					sizes="(min-width: 1180px) 1120px, calc(100vw - 2rem)"
					src="/marketing/studio-nova-inbox.webp"
					width={2880}
				/>
			</div>
		</div>
	</section>
);
