interface Props {
  readonly children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="bg-linear-to-b from-sky-100 to-transparent dark:from-slate-900 dark:to-transparent">
      <div className="mx-auto flex items-center flex-col justify-center">
        {children}
      </div>
    </section>
  );
}
