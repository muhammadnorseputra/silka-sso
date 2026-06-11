interface Props {
  readonly children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="bg-[url('/assets/images/bg-ai-kantor-bkpsdm.png')] bg-cover lg:bg-center lg:bg-cover lg:bg-fixed">
      <div className="min-h-screen bg-white/10 dark:bg-black/50 mx-auto flex items-center flex-col gap-8 justify-center">
        {children}
      </div>
    </section>
  );
}
