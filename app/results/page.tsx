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
      const authUser = session?.user;
      if (authUser && authUser.email && authUser.name) {
        const dbUserDetails = await prisma.user.findUnique({
          where: { email: authUser.email },
        });
        let dbUserId = dbUserDetails?.id;
        // If the user doesn't exist in DB, create the user in DB
        if (!dbUserId) {
          const newDbUser = await prisma.user.create({
            data: {
              name: authUser.name,
              email: authUser.email,
            },
          });
          dbUserId = newDbUser?.id;
        }
        const timestamp = Math.floor(Date.now() / 1000);
        const newResult = await prisma.result.create({
          data: {
            timestamp,
            siteUrl: url,
            userId: dbUserId,
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
