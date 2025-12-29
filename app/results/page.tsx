import { auth0 } from "@/lib/auth0";
import ScreenResults from "@/app/components/screen-results";
import prisma from "@/lib/prisma";
import { NormalizedAxeResult } from "@/app/models/screen-results";

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
      const session = await auth0.getSession();
      const user = session?.user;
      if (user) {
        const userDetails = await prisma.user.findUnique({
          where: { email: user?.email },
        });
        const userId = userDetails?.id;
        const timestamp = Math.floor(Date.now() / 1000);
        const newResult = await prisma.result.create({
          data: {
            timestamp,
            siteUrl: url,
            userId: userId || 0,
          },
        });
        screenResults.forEach(async (result: NormalizedAxeResult) => {
          await prisma.violation.create({
            data: {
              title: result.title,
              description: result.description,
              severity: result.severity,
              wcag: result.wcag,
              affectedNodes: result.affectedNodes,
              resultId: newResult.id,
            },
          });
        });
        console.log("done");
      }
    }
  } catch (err) {
    throw new Error(err as string);
  }
  return (
    <div className="min-h-screen font-sans dark:text-white dark:bg-black">
      <ScreenResults siteUrl={url} screenResults={screenResults} />
    </div>
  );
}
