"use client";

import { Button } from "@/components/ui/button";

const Error = ({ error, reset }: { error: Error, reset: () => void }) => (
  <div className="flex flex-col gap-10 justify-center items-center h-screen">
    <p>{error.message}</p>
    <Button onClick={reset}>Try Again</Button>
  </div>
);

export default Error;