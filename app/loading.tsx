import { Spinner } from "@/components/ui/spinner";

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner className="size-8 text-purple-500" />
  </div>
);

export default Loading;