import type { Metadata } from "next";
import { WorkspacePage } from "@/modules/page-shell/components/WorkspacePage";

export const metadata: Metadata = {
	title: "Vendors — Kuvro",
};

export default function Vendors() {
	return <WorkspacePage section="vendors" />;
}
