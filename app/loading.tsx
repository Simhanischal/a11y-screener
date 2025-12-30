import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
  <div className="flex flex-col gap-10 justify-center items-center min-h-[100vh]">
    <div className="flex flex-col gap-2 items-center">
      <Skeleton className="h-[50px] w-[690px] rounded-xl" />
      <Skeleton className="h-[30px] w-[70px] rounded-sm text-center" />
      <Skeleton className="h-[50px] w-[690px] rounded-xl" />
    </div>
    <div className="flex justify-center items-center gap-3">
      <Skeleton className="h-[50px] w-[500px] rounded-xl" />
      <Skeleton className="h-[45px] w-[100px] rounded-xl" />
    </div>
  </div>
);

export default Loading;
