"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-10 justify-center items-center h-screen">
      <p>{error.message}</p>
      <div className="flex gap-2 items-center">
        <Button variant="link" onClick={() => router.back()}>
          <ArrowLeft /> Back
        </Button>
        <Button variant="default" onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
};

export default Error;
