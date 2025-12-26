"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner";
import DOMPurify from "dompurify";
import { ScanText } from "lucide-react";

interface SiteInputProps {
  siteUrl: string;
  setSiteUrl: (url: string) => void;
  inputError: string;
  setInputError: (error: string) => void;
  handleScreen: () => void;
  isScreenButtonLoading: boolean;
}

export default function SiteInput ({ siteUrl, setSiteUrl, inputError, setInputError, handleScreen, isScreenButtonLoading }: SiteInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input) {
      setSiteUrl('');
      setInputError('URL cannot be empty');
    } else {
      const sanitizedInput = DOMPurify.sanitize(e.target.value);
      setSiteUrl(sanitizedInput);
      setInputError('');
    }
  }

  return (
    <main className="flex justify-center gap-3">
      <div className="flex flex-col gap-2">
        <Input
          className="min-w-full md:min-w-[500px] h-[50px]"
          value={siteUrl}
          onChange={handleInputChange}
          aria-placeholder="Enter your site's URL to start screening for accessibility issues"
        />
        {inputError && (
          <p className="text-red-500 text-sm font-medium" role="alert" aria-live="assertive" aria-label="Input Error:">{inputError}</p>
        )}
      </div>
      <Button className="h-[45px]" disabled={!siteUrl || isScreenButtonLoading} onClick={handleScreen}>
        {isScreenButtonLoading && <Spinner />}
        Screen <ScanText />
      </Button>
    </main>
  );
}