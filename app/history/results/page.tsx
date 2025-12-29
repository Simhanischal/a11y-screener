import { auth0 } from "@/lib/auth0";
import ScreenResults from "@/app/components/screen-results";
import prisma from "@/lib/prisma";
import { NormalizedAxeResult } from "@/app/models/screen-results";

export default async function HistoryResults({
  searchParams,
}: {
  searchParams: Promise<{ [id: string]: string }>;
}) {
  let violations: NormalizedAxeResult[] = [];
  let siteUrl = "";
  const { id } = await searchParams;
  try {
    if (!id) {
      throw new Error("Bad request");
    }
    const session = await auth0.getSession();
    const user = session?.user;
    if (!user) {
      throw new Error("Unauthenticated");
    }
    const userDetails = await prisma.user.findUnique({
      where: { email: user?.email },
    });
    const userId = userDetails?.id;
    const result = await prisma.result.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (userId !== result?.userId) {
      throw new Error("Unathorized");
    }
    siteUrl = result?.siteUrl || "";
    violations = await prisma.violation.findMany({
      where: { resultId: result?.id },
    });
    console.log(violations);
  } catch (err) {
    throw new Error(err as string);
  }
  return (
    <div className="min-h-screen font-sans dark:text-white dark:bg-black">
      <ScreenResults siteUrl={siteUrl} screenResults={violations} />
    </div>
  );
}
