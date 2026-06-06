interface Props {
  readonly children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="bg-[url('https://img.magnific.com/free-vector/gradient-blur-pink-blue-abstract-background_53876-117324.jpg')] bg-cover lg:bg-center lg:bg-cover lg:bg-fixed">
      <div className="min-h-screen bg-white/20 dark:bg-black/90 mx-auto flex items-center flex-col gap-8 justify-center py-4 md:py-4 px-2 sm:px-4 md:px-8">
        {children}
      </div>
    </section>
  );
}
