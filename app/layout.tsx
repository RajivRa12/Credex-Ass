import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { Navbar } from "../components/common/navbar";
import { Footer } from "../components/common/footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
	variable: "--font-ibm-plex-mono",
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://spendscope.ai"),
	title: {
		default: "SpendScope AI",
		template: "%s | SpendScope AI",
	},
	description: "A polished audit experience for AI and productivity tool spend.",
	openGraph: {
		type: "website",
		siteName: "SpendScope AI",
		title: "SpendScope AI",
		description: "Audit AI and productivity spend with honest, explainable recommendations.",
	},
	twitter: {
		card: "summary_large_image",
		title: "SpendScope AI",
		description: "Audit AI and productivity spend with honest, explainable recommendations.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<Navbar />
				<main className="flex-1">{children}</main>
				<Footer />
			</body>
		</html>
	);
}