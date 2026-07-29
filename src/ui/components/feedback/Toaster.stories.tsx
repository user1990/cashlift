"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bell, Check, Clock, Layers3, LoaderCircle, RotateCcw, ShieldAlert, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/ui/components/actions/Button";
import { Toaster } from "@/ui/components/feedback/Toaster";

const meta = {
	parameters: {
		layout: "centered",
	},
	title: "Feedback/Toaster",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const StateMatrix: Story = {
	render: () => <ToasterStateMatrix />,
};

const ToasterStateMatrix = () => (
	<div className="flex max-w-3xl flex-start flex-col items-center justify-center gap-3">
		<Toaster />

		<Button
			onPress={() =>
				toast("Workspace synced", {
					description: "Latest cash and spend data is ready.",
				})
			}
			variant="secondary"
		>
			<Bell aria-hidden className="size-4" />
			Default
		</Button>

		<Button
			onPress={() =>
				toast.info("Cash alert queued", {
					description: "Finance owners will see this in the dashboard.",
				})
			}
			variant="secondary"
		>
			<ShieldAlert aria-hidden className="size-4" />
			Info
		</Button>

		<Button
			onPress={() =>
				toast.success("Spend approved", {
					description: "BrandForge",
				})
			}
			variant="success"
		>
			<Check aria-hidden className="size-4" />
			Success
		</Button>

		<Button
			onPress={() =>
				toast.error("Spend update failed", {
					description: "Unable to update spend request.",
				})
			}
			variant="secondary"
		>
			<X aria-hidden className="size-4" />
			Error
		</Button>

		<Button
			onPress={() =>
				toast.warning("Cash buffer risk", {
					description: "Approving this spend drops runway below target.",
				})
			}
			variant="secondary"
		>
			<TriangleAlert aria-hidden className="size-4" />
			Warning
		</Button>

		<Button
			onPress={() =>
				toast.loading("Exporting report", {
					description: "Preparing the latest workspace snapshot.",
				})
			}
			variant="secondary"
		>
			<LoaderCircle aria-hidden className="size-4" />
			Loading
		</Button>

		<Button
			onPress={() =>
				toast.promise(delay(1_000), {
					error: "Export failed",
					loading: "Exporting report",
					success: "Report exported",
				})
			}
			variant="secondary"
		>
			<Clock aria-hidden className="size-4" />
			Promise
		</Button>

		<Button
			onPress={() =>
				toast("Request rejected", {
					action: {
						label: "Undo",
						onClick: () => toast.success("Request restored"),
					},
					description: "Delta onsite equipment",
				})
			}
			variant="secondary"
		>
			<RotateCcw aria-hidden className="size-4" />
			Action
		</Button>

		<Button
			onPress={() =>
				toast("Dismissible alert", {
					description: "Use the close button or wait for the timer.",
				})
			}
			variant="secondary"
		>
			<X aria-hidden className="size-4" />
			Dismissible
		</Button>

		<Button
			onPress={() => {
				for (const label of [
					"Approval queued",
					"Invoice flagged",
					"Budget updated",
					"Vendor reviewed",
					"Cash note saved",
				]) {
					toast(label);
				}
			}}
			variant="primary"
		>
			<Layers3 aria-hidden className="size-4" />
			Stack burst
		</Button>
	</div>
);

const delay = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));
