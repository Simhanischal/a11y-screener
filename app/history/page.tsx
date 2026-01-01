import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import HistoryTable from "../components/history-table";

export default async function History() {
  try {
    const session = await auth0.getSession();
    const user = session?.user;
    const userDetails = await prisma.user.findUnique({ where: { email: user?.email } });
    const userId = userDetails?.id;
    const userResults = userId? await prisma.result.findMany({ where: { userId } }) : [];
    return (
      <div className="w-[100vw] font-sans flex flex-col items-center gap-10 mt-15">
        <header className="mt-10">
          <h3 className="font-bold text-xl" aria-label="History heading">History</h3>
        </header>
        <main className="max-w-[95vw] md:min-w-[75vw]">
          <HistoryTable data={userResults}  />
        </main>
      </div>
    );
  } catch {
    return (
      <h3 font-medium text-xl>Something went wrong! Please try again after some time.</h3>
    )
  }
}
