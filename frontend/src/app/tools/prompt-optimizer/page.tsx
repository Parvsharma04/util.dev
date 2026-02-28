"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Zap, Wand2, RotateCcw, Info } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

interface OptimizationOption {
	id: string;
	label: string;
	description: string;
	enabled: boolean;
}

const PromptOptimizer = () => {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const { toast } = useToast();

	const [options, setOptions] = useState<OptimizationOption[]>([
		{
			id: "whitespace",
			label: "Normalize Whitespace",
			description: "Remove extra spaces, normalize newlines",
			enabled: true,
		},
		{
			id: "redundant",
			label: "Remove Redundant Phrases",
			description: "Strip filler words like 'please', 'kindly'",
			enabled: true,
		},
		{
			id: "contractions",
			label: "Use Contractions",
			description: "Convert 'do not' → 'don't', etc.",
			enabled: true,
		},
		{
			id: "bullets",
			label: "Convert to Bullets",
			description: "Transform numbered lists to compact bullets",
			enabled: false,
		},
		{
			id: "abbreviate",
			label: "Common Abbreviations",
			description: "Use common abbrevs (e.g., 'for example' → 'e.g.')",
			enabled: true,
		},
		{
			id: "removeMarkdown",
			label: "Simplify Markdown",
			description: "Remove unnecessary markdown formatting",
			enabled: false,
		},
	]);

	const [stats, setStats] = useState({
		inputTokens: 0,
		outputTokens: 0,
		saved: 0,
		savedPercent: 0,
	});

	// Rough token estimation
	const estimateTokens = (text: string): number => {
		if (!text) return 0;
		const words = text.split(/\s+/).filter((w) => w.length > 0);
		let tokens = 0;
		for (const word of words) {
			tokens += Math.ceil(word.length / 4);
		}
		return Math.max(1, tokens);
	};

	const toggleOption = (id: string) => {
		setOptions((prev) =>
			prev.map((opt) =>
				opt.id === id ? { ...opt, enabled: !opt.enabled } : opt,
			),
		);
	};

	const optimize = () => {
		if (!input.trim()) {
			toast({
				title: "Error",
				description: "Please enter some text",
				variant: "destructive",
			});
			return;
		}

		let result = input;
		const enabledOpts = options.filter((o) => o.enabled).map((o) => o.id);

		// Normalize whitespace
		if (enabledOpts.includes("whitespace")) {
			result = result
				.replace(/\r\n/g, "\n")
				.replace(/[ \t]+/g, " ")
				.replace(/\n{3,}/g, "\n\n")
				.replace(/^\s+|\s+$/gm, "")
				.trim();
		}

		// Remove redundant phrases
		if (enabledOpts.includes("redundant")) {
			const redundantPhrases = [
				/\bplease\b\s*/gi,
				/\bkindly\b\s*/gi,
				/\bI would like you to\b/gi,
				/\bCould you please\b/gi,
				/\bI want you to\b/gi,
				/\bI need you to\b/gi,
				/\bI'd like you to\b/gi,
				/\bbasically\b\s*/gi,
				/\bactually\b\s*/gi,
				/\bjust\b\s+/gi,
				/\breally\b\s*/gi,
				/\bvery\b\s+/gi,
				/\bquite\b\s+/gi,
				/\bliterally\b\s*/gi,
				/\bin order to\b/gi,
				/\bdue to the fact that\b/gi,
				/\bat this point in time\b/gi,
				/\bin the event that\b/gi,
				/\bfor the purpose of\b/gi,
				/\bwith regard to\b/gi,
				/\bin terms of\b/gi,
			];

			redundantPhrases.forEach((phrase) => {
				result = result.replace(phrase, (match) => {
					// Preserve case for replacements
					if (phrase.toString().includes("in order to")) return "to ";
					if (phrase.toString().includes("due to the fact that"))
						return "because ";
					if (phrase.toString().includes("at this point in time"))
						return "now ";
					if (phrase.toString().includes("in the event that")) return "if ";
					if (phrase.toString().includes("for the purpose of")) return "to ";
					if (phrase.toString().includes("with regard to")) return "about ";
					if (phrase.toString().includes("in terms of")) return "regarding ";
					return "";
				});
			});
		}

		// Use contractions
		if (enabledOpts.includes("contractions")) {
			const contractions: [RegExp, string][] = [
				[/\bdo not\b/gi, "don't"],
				[/\bdoes not\b/gi, "doesn't"],
				[/\bdid not\b/gi, "didn't"],
				[/\bwill not\b/gi, "won't"],
				[/\bwould not\b/gi, "wouldn't"],
				[/\bcould not\b/gi, "couldn't"],
				[/\bshould not\b/gi, "shouldn't"],
				[/\bcan not\b/gi, "can't"],
				[/\bcannot\b/gi, "can't"],
				[/\bis not\b/gi, "isn't"],
				[/\bare not\b/gi, "aren't"],
				[/\bwas not\b/gi, "wasn't"],
				[/\bwere not\b/gi, "weren't"],
				[/\bhas not\b/gi, "hasn't"],
				[/\bhave not\b/gi, "haven't"],
				[/\bhad not\b/gi, "hadn't"],
				[/\bI am\b/gi, "I'm"],
				[/\bI will\b/gi, "I'll"],
				[/\bI would\b/gi, "I'd"],
				[/\bI have\b/gi, "I've"],
				[/\byou are\b/gi, "you're"],
				[/\byou will\b/gi, "you'll"],
				[/\byou would\b/gi, "you'd"],
				[/\byou have\b/gi, "you've"],
				[/\bthey are\b/gi, "they're"],
				[/\bthey will\b/gi, "they'll"],
				[/\bthey would\b/gi, "they'd"],
				[/\bthey have\b/gi, "they've"],
				[/\bwe are\b/gi, "we're"],
				[/\bwe will\b/gi, "we'll"],
				[/\bwe would\b/gi, "we'd"],
				[/\bwe have\b/gi, "we've"],
				[/\bit is\b/gi, "it's"],
				[/\bit will\b/gi, "it'll"],
				[/\bit would\b/gi, "it'd"],
				[/\bthat is\b/gi, "that's"],
				[/\bthere is\b/gi, "there's"],
				[/\bwhat is\b/gi, "what's"],
				[/\bwho is\b/gi, "who's"],
				[/\blet us\b/gi, "let's"],
			];

			contractions.forEach(([pattern, replacement]) => {
				result = result.replace(pattern, replacement);
			});
		}

		// Common abbreviations
		if (enabledOpts.includes("abbreviate")) {
			const abbreviations: [RegExp, string][] = [
				[/\bfor example\b/gi, "e.g."],
				[/\bthat is\b/gi, "i.e."],
				[/\band so on\b/gi, "etc."],
				[/\betcetera\b/gi, "etc."],
				[/\bversus\b/gi, "vs."],
				[/\bapproximately\b/gi, "~"],
				[/\bwithout\b/gi, "w/o"],
				[/\bwith\b/gi, "w/"],
				[/\binformation\b/gi, "info"],
				[/\bconfiguration\b/gi, "config"],
				[/\bapplication\b/gi, "app"],
				[/\bdocumentation\b/gi, "docs"],
				[/\bspecification\b/gi, "spec"],
				[/\brepository\b/gi, "repo"],
				[/\bdirectory\b/gi, "dir"],
				[/\benvironment\b/gi, "env"],
			];

			abbreviations.forEach(([pattern, replacement]) => {
				result = result.replace(pattern, replacement);
			});
		}

		// Convert to bullets
		if (enabledOpts.includes("bullets")) {
			// Convert numbered lists to bullets
			result = result.replace(/^\d+[.)]\s*/gm, "• ");
		}

		// Simplify markdown
		if (enabledOpts.includes("removeMarkdown")) {
			result = result
				.replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
				.replace(/\*([^*]+)\*/g, "$1") // Italic
				.replace(/__([^_]+)__/g, "$1") // Bold
				.replace(/_([^_]+)_/g, "$1") // Italic
				.replace(/`([^`]+)`/g, "$1") // Inline code
				.replace(/^#{1,6}\s+/gm, ""); // Headers
		}

		// Final cleanup
		result = result.replace(/\s{2,}/g, " ").trim();

		setOutput(result);

		const inputTokens = estimateTokens(input);
		const outputTokens = estimateTokens(result);
		const saved = inputTokens - outputTokens;

		setStats({
			inputTokens,
			outputTokens,
			saved,
			savedPercent: inputTokens > 0 ? (saved / inputTokens) * 100 : 0,
		});
	};

	const copyOutput = () => {
		navigator.clipboard.writeText(output);
		toast({
			title: "Copied!",
			description: "Optimized prompt copied to clipboard",
		});
	};

	const clear = () => {
		setInput("");
		setOutput("");
		setStats({ inputTokens: 0, outputTokens: 0, saved: 0, savedPercent: 0 });
	};

	return (
		<ToolLayout title="Prompt Optimizer" description="Reduce token count in your LLM prompts" category="AI Tools" icon={Wand2}>
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Options Sidebar */}
				<Card className="bg-card border-border lg:col-span-1">
					<CardHeader>
						<CardTitle className="text-foreground font-mono text-sm">
							Optimizations
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{options.map((opt) => (
							<div key={opt.id} className="flex items-start space-x-3">
								<Checkbox
									id={opt.id}
									checked={opt.enabled}
									onCheckedChange={() => toggleOption(opt.id)}
								/>
								<div className="grid gap-1 leading-none">
									<Label
										htmlFor={opt.id}
										className="text-sm font-medium text-foreground cursor-pointer"
									>
										{opt.label}
									</Label>
									<p className="text-xs text-muted-foreground">
										{opt.description}
									</p>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Main Content */}
				<div className="lg:col-span-3 space-y-6">
					{/* Stats Bar */}
					{stats.inputTokens > 0 && (
						<Card className="bg-card border-border">
							<CardContent className="py-4">
								<div className="flex flex-wrap items-center justify-between gap-4">
									<div className="flex items-center gap-6">
										<div>
											<p className="text-xs text-muted-foreground">Input</p>
											<p className="text-lg font-mono text-foreground">
												{stats.inputTokens} tokens
											</p>
										</div>
										<div className="text-muted-foreground">→</div>
										<div>
											<p className="text-xs text-muted-foreground">Output</p>
											<p className="text-lg font-mono text-foreground">
												{stats.outputTokens} tokens
											</p>
										</div>
									</div>
									{stats.saved > 0 && (
										<Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
											-{stats.saved} tokens ({stats.savedPercent.toFixed(1)}%)
										</Badge>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Input */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-3">
								<CardTitle className="text-foreground font-mono">
									Original Prompt
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Textarea
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Paste your prompt here..."
									className="min-h-[350px] font-mono text-sm bg-background border-border resize-none"
								/>
							</CardContent>
						</Card>

						{/* Output */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-3">
								<CardTitle className="text-foreground font-mono">
									Optimized Prompt
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Textarea
									value={output}
									readOnly
									placeholder="Optimized prompt will appear here..."
									className="min-h-[350px] font-mono text-sm bg-background border-border resize-none"
								/>
							</CardContent>
						</Card>
					</div>

					{/* Actions */}
					<div className="flex flex-wrap gap-3 justify-center">
						<Button onClick={optimize} className="min-w-[140px]">
							<Wand2 className="w-4 h-4 mr-2" />
							Optimize
						</Button>
						<Button onClick={copyOutput} variant="outline" disabled={!output}>
							<Copy className="w-4 h-4 mr-2" />
							Copy
						</Button>
						<Button onClick={clear} variant="outline">
							<RotateCcw className="w-4 h-4 mr-2" />
							Clear
						</Button>
					</div>
				</div>
			</div>

			{/* Tips */}
			<Card className="mt-8 bg-muted/50 border-border">
				<CardHeader>
					<CardTitle className="text-foreground font-mono text-lg flex items-center gap-2">
						<Info className="w-5 h-5" />
						Tips for Prompt Optimization
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-muted-foreground">
					<ul className="list-disc list-inside space-y-1">
						<li>
							Use <strong className="text-foreground">TOON format</strong>{" "}
							instead of JSON/YAML for structured data
						</li>
						<li>
							Prefer{" "}
							<strong className="text-foreground">bullet points</strong> over
							paragraphs for instructions
						</li>
						<li>
							Use <strong className="text-foreground">abbreviations</strong>{" "}
							where context is clear
						</li>
						<li>
							Remove{" "}
							<strong className="text-foreground">politeness phrases</strong>{" "}
							— LLMs don't need them
						</li>
						<li>
							Use{" "}
							<strong className="text-foreground">
								shorter variable names
							</strong>{" "}
							in code examples
						</li>
						<li>
							Consider{" "}
							<strong className="text-foreground">tab delimiters</strong> over
							commas (better tokenization)
						</li>
					</ul>
				</CardContent>
			</Card>
		</ToolLayout>
	);
};

export default PromptOptimizer;
