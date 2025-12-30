import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import HistoryTable from "../components/history-table";
import { convertEpochToDateTime } from "../lib/common-utils";

export default async function History() {
  try {
    const session = await auth0.getSession();
    const user = session?.user;
    const userDetails = await prisma.user.findUnique({ where: { email: user?.email } });
    const userId = userDetails?.id;
    const userResults = userId? await prisma.result.findMany({ where: { userId } }) : [];
    const formattedUserResults = userResults.map(result => ({
      ...result, timestamp: convertEpochToDateTime(result.timestamp),
    }));
    return (
      <div className="w-[100vw] font-sans dark:text-white dark:bg-black flex flex-col items-center gap-10 mt-15">
        <header className="mt-10">
          <h3 className="font-bold text-xl" aria-label="History heading">History</h3>
        </header>
        <main className="min-w-[100vw] md:min-w-[75vw]">
          <HistoryTable data={formattedUserResults}  />
        </main>
      </div>
    );
  } catch {
    return (
      <h3 font-medium text-xl>Something went wrong! Please try again after some time.</h3>
    )
  }
}
