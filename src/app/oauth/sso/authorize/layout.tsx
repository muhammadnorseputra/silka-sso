interface Props {
  readonly children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="bg-linear-to-b min-h-screen from-sky-100 to-white dark:from-slate-900 dark:to-slate-600">
      <div className="mx-auto flex items-center flex-col justify-center">
        {children}
      </div>
    </section>
  );
}
