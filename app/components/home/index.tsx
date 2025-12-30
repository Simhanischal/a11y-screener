"use client";

import { useState } from "react"
import SiteInput from "@/app/components/site-input";
import { useRouter } from "next/navigation";

export default function HomeComponent () {
  const [siteUrl, setSiteUrl] = useState('');
  const [inputError, setInputError] = useState('');
  const [isScreenButtonLoading, setIsScreenButtonLoading] = useState(false);
  const router = useRouter();

  const handleScreen = async () => {
    setIsScreenButtonLoading(true);
    if (!URL.canParse(siteUrl)){
      setInputError('Enter a valid URL');
    } else if (!siteUrl) {
      setInputError('URL cannot be empty');
    } else {
      setInputError('');
      router.push(`/results?url=${siteUrl}`);
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