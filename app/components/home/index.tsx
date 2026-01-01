"use client";

import { useState } from "react"
import SiteInput from "@/app/components/site-input";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";

export default function HomeComponent ({ url }: { url: string }) {
  const [siteUrl, setSiteUrl] = useState(url || '');
  const [inputError, setInputError] = useState('');
  const [isScreenButtonLoading, setIsScreenButtonLoading] = useState(false);
  const router = useRouter();

  const handleScreen = async () => {
    setIsScreenButtonLoading(true);
    if (!URL.canParse(siteUrl)){
      setInputError('Enter a valid URL');
    } else if (!siteUrl) {
      setInputError('URL cannot be empty');
    } else if (process.env.NEXT_PUBLIC_BASE_URL && siteUrl.trim().includes(process.env.NEXT_PUBLIC_BASE_URL)) {
      setInputError("You genius! We won't allow that :)");
    } else {
      setInputError('');
      const sanitizedSiteUrl = DOMPurify.sanitize(siteUrl);
      router.push(`/results?url=${sanitizedSiteUrl}`);
    }
    setIsScreenButtonLoading(false);
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <header>
        <h1 className="text-center font-mono text-xl lg:text-4xl font-bold text-amber-500">Screen your site for a11y issues</h1>
        <h1 className="text-center font-serif text-sm lg:text-xl">and</h1>
        <h1 className="text-center font-mono text-xl lg:text-4xl font-bold text-emerald-500">Generate AI powered code fixes</h1>
      </header>
      <SiteInput
        siteUrl={siteUrl}
        setSiteUrl={setSiteUrl}
        inputError={inputError}
        setInputError={setInputError}
        handleScreen={handleScreen}
        isScreenButtonLoading={isScreenButtonLoading}
      />
    </div>
  );
}