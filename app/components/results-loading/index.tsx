import { Skeleton } from "@/components/ui/skeleton";

const ResultsLoading = () => (
  <div className="flex flex-col gap-5 mt-25 items-center h-screen">
    <div className="flex justify-center items-center gap-3">
      <Skeleton className="h-[35px] w-[250px] rounded-xl" />
      <Skeleton className="h-[35px] w-[75px] rounded-xl" />
    </div>
    <Skeleton className="h-[35px] w-[120px] rounded-xl" />
    <div className="flex flex-col gap-5">
      {new Array(3).fill(0).map((val, index) => (
        <Skeleton
          key={index}
          className="h-[45px] min-w-[100vw] md:min-w-[75vw] rounded-xl"
        />
      ))}
    </div>
  </div>
);

export default ResultsLoading;