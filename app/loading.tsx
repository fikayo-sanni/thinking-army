import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 min-h-screen items-center justify-center">
      <Skeleton className="h-16 w-16 rounded-full bg-[#2C2F3C]" />
    </div>
  );
}
