"use client";

import {
  GenerationResult,
  NormalizedAxeResult,
} from "@/app/models/screen-results";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MouseEvent, useState } from "react";
import { GenerateCodeFix } from "../code-fix-modal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Severity } from "@/app/constants/common.constants";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const InfoPopover = ({ noOfElements }: { noOfElements: number }) => (
  <Popover>
    <PopoverTrigger>
      <Info size="16" />
    </PopoverTrigger>
    <PopoverContent side="top" className="min-w-full md:min-w-[500px]">
      There are {noOfElements} affected elements. But, for performance reasons,
      we are displaying only the first 10 elements. You can generate fixes for
      elements present on the screen, go through similar issues in your HTML
      code and fix them accordingly.
    </PopoverContent>
  </Popover>
);

export default function ScreenResults({
  siteUrl,
  screenResults,
}: {
  siteUrl: string;
  screenResults: NormalizedAxeResult[];
}) {
  const [accordionTriggerCssClasses, setAccordionTriggerCssClasses] = useState(
    "text-lg font-bold rounded-xs"
  );
  const [generationResult, setGenerationResult] = useState<GenerationResult>({
    fix: "",
    reason: "",
  });
  const [isGenerationLoading, setIsGenerationLoading] = useState(false);
  const router = useRouter();

  const handleCssClass = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset.state === "closed") {
      setAccordionTriggerCssClasses("text-lg font-bold rounded-xs border-b-3");
    } else {
      setAccordionTriggerCssClasses("text-lg font-bold rounded-xs");
    }
  };

  const getSeverityStyling = (severity: string) => {
    switch (severity) {
      case Severity.CRITiCAL:
        return "bg-red-500 text-white font-medium";
      case Severity.SERIOUS:
        return "bg-orange-400 text-black font-medium";
      case Severity.MODERATE:
        return "bg-yellow-500 text-black font-medium";
      case Severity.MINOR:
        return "bg-stone-400 text-black font-medium";
    }
  };

  const handleEditUrl = () => {
    router.push("/");
  };

  const generateFix = async (
    issueDescription: string,
    affectedHtml: string
  ) => {
    setIsGenerationLoading(true);
    try {
      const response = await fetch(`/api/screen/generate_fix`, {
        method: "POST",
        body: JSON.stringify({ issueDescription, affectedHtml }),
      });
      const jsonResponse = await response.json();

      setGenerationResult(jsonResponse);
    } catch (err) {
      if (typeof err === "string") {
        toast.error(err as string);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsGenerationLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <header className="flex flex-col items-center justify-content gap-5 mt-10">
        <div className="flex justify-center items-center gap-3">
          <span className="border border-solid border-zinc-500 rounded-md text-sm font-medium px-4 py-2">
            {siteUrl}
          </span>
          <Button variant="outline" onClick={handleEditUrl}>
            <ArrowLeft /> Edit
          </Button>
        </div>
        <p className="font-bold text-xl">Violations</p>
      </header>
      <div className="border border-solid border-zinc-500 rounded-md text-sm font-medium shadow-xl/3 shadow-red-500 mt-4 px-4 py-2">
        <Accordion type="single" collapsible className="w-[75vw]">
          {screenResults.map((result) => (
            <AccordionItem key={result.id} value={result.id}>
              <AccordionTrigger
                onClick={handleCssClass}
                className={accordionTriggerCssClasses}
              >
                {result.title}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance text-md border-b-3 mt-5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-stone-300">Reason</span>
                  <span className="font-medium">{result.description}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-stone-300">Severity</span>
                  <Badge className={getSeverityStyling(result.severity)}>
                    {result.severity}
                  </Badge>
                </div>
                {result.wcag.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-stone-300">Tags </span>
                    <div className="flex gap-2">
                      {result.wcag.map((tag) => (
                        <Badge className="font-medium" key={tag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <p className="flex items-center gap-2 text-base font-medium mt-3 cursor-pointer">
                  Affected Elements
                  {result.affectedNodes.length > 10 && (
                    <InfoPopover noOfElements={result.affectedNodes.length} />
                  )}
                </p>
                <ul style={{ display: "flex", flexDirection: "column" }}>
                  {result.affectedNodes.slice(0, 10).map((node) => (
                    <li key={node} className="mb-5 flex gap-5 items-center">
                      <SyntaxHighlighter
                        language="html"
                        style={dracula}
                        wrapLines
                        wrapLongLines
                        customStyle={{ width: "90%" }}
                      >
                        {node}
                      </SyntaxHighlighter>
                      <GenerateCodeFix
                        description={result.description}
                        affectedCode={node}
                        generateFix={generateFix}
                        isGenerationLoading={isGenerationLoading}
                        generationResult={generationResult}
                        setGenerationResult={setGenerationResult}
                      />
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
