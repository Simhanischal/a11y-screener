import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
  <div className="flex flex-col gap-5 mt-25 items-center h-screen">
    <Skeleton className="h-[35px] w-[120px] rounded-xl" />
    <Skeleton className="mt-5 h-[35px] min-w-[100vw] md:min-w-[75vw] rounded-xl"/>
    <div className="flex gap-3 jsutify-center">
      {new Array(3).fill(0).map((val, index) => (
        <Skeleton
          key={index}
          className="h-[35px] w-[120px] rounded-xl"
        />
      ))}
    </div>
    <div className="flex flex-col gap-5">
      {new Array(5).fill(0).map((val, index) => (
        <Skeleton
          key={index}
          className="h-[25px] min-w-[100vw] md:min-w-[75vw] rounded-xl"
        />
      ))}
    </div>
  </div>
);

export default Loading;
