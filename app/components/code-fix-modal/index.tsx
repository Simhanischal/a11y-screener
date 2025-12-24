import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactDiffViewer from "react-diff-viewer";
import { Copy, Sparkle } from "lucide-react";
import { GenerationResult } from "@/app/models/screen-results";
import { toast } from "sonner";

interface GenerateCodeFixProps {
  description: string;
  affectedCode: string;
  generateFix: (description: string, affectedCode: string) => void;
  isGenerationLoading: boolean;
  generationResult: GenerationResult;
  setGenerationResult: (result: GenerationResult) => void;
}

const Description = ({
  affectedCode,
  isGenerationLoading,
  generationResult,
}: {
  affectedCode: string;
  isGenerationLoading: boolean;
  generationResult: GenerationResult;
}) => {
  if (isGenerationLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 max-w-[250px]" />
        <Skeleton className="h-[150px] max-w-[500px] rounded-xl" />
      </div>
    );
  }
  if (generationResult.fix) {
    return (
      <ReactDiffViewer
        splitView={false}
        oldValue={affectedCode}
        newValue={generationResult.fix}
        useDarkTheme
      />
    );
  }
  if (generationResult.reason) {
    return <span className="text-md">{generationResult.reason}</span>;
  }
  return <span className="text-base text-red-500">Something went wrong! Please try again later</span>;
};

export function GenerateCodeFix({
  description,
  affectedCode,
  generateFix,
  isGenerationLoading,
  generationResult,
  setGenerationResult,
}: GenerateCodeFixProps) {

  const copyCodeFix = () => {
    navigator.clipboard.writeText(generationResult.fix || '');
    toast.success('Code fix copied to clipboard');
  }

  return (
    <div className="bg-zinc-50 font-sans dark:text-white dark:bg-black">
      <Dialog
        onOpenChange={(open) => {
          if (open) {
            generateFix(description, affectedCode);
          } else {
            setGenerationResult({ fix: "", reason: "" });
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-purple-500 text-white hover:bg-purple-300 hover:text-black">
            <Sparkle /> Generate Fix
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-full md:min-w-[800px]">
          <DialogHeader>
            <DialogTitle>Issue</DialogTitle>
            <DialogDescription className="text-md">
              {description}
            </DialogDescription>
            {!isGenerationLoading && (
              <DialogTitle className="mt-4">
                {generationResult.fix
                  ? "Code Diff"
                  : "Could not generate code fix as"}
              </DialogTitle>
            )}
            <DialogDescription>
              <Description
                affectedCode={affectedCode}
                isGenerationLoading={isGenerationLoading}
                generationResult={generationResult}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col md:flex gap-5">
            {generationResult.fix && (
              <Button onClick={copyCodeFix}>
                <Copy /> Copy Code Fix
              </Button>
            )}
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
