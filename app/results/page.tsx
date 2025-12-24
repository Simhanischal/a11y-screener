import ScreenResults from "../components/screen-results";

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ [url: string]: string }>;
}) {
  let screenResults = [];
  const { url } = await searchParams;
  try {
    if (url) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/screen/result?url=${url}`
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const jsonResponse = await response.json();
      screenResults = jsonResponse?.results;
    }
  } catch (err) {
    throw new Error(err as string);
  }
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:text-white dark:bg-black">
      <ScreenResults siteUrl={url} screenResults={screenResults} />
    </div>
  );
}
