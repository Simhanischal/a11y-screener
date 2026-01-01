import HomeComponent from "@/app/components/home";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [url: string]: string }>;
}) {
  const { url } = await searchParams;
  return (
    <div className="font-sans min-h-[100vh] flex items-center justify-center">
      <HomeComponent url={url || ''} />
    </div>
  );
}