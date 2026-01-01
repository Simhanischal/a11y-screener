import { auth0 } from "@/lib/auth0";
import ScreenResults from "@/app/components/screen-results";
import { NormalizedAxeResult } from "@/app/models/screen-results";

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ [url: string]: string }>;
}) {
  let screenResults: NormalizedAxeResult[] = [];
  const { url } = await searchParams;
  try {
    if (url) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/screen/result?url=${url}`
      );
      if (!response.ok) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      screenResults = jsonResponse?.results;
      const session = await auth0.getSession();
      const authUser = session?.user;
      if (authUser && authUser.email && authUser.name) {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/screen/result`, {
          method: "POST",
          body: JSON.stringify({ results: screenResults, authUser, url }),
        });
      }
    }
  } catch {
    throw new Error();
  }
  return (
    <div className="font-sans mt-15">
      <ScreenResults siteUrl={url} screenResults={screenResults} />
    </div>
  );
}
