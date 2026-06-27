import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

interface Props {
  readonly children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="bg-linear-to-b from-sky-100 to-transparent dark:from-slate-900 dark:to-transparent">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "mask-[radial-gradient(700px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="mx-auto flex items-center flex-col justify-center">
        {children}
      </div>
    </section>
  );
}
