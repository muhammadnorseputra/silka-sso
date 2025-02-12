interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="bg-[url('https://static.vecteezy.com/system/resources/previews/002/844/147/non_2x/closed-padlock-on-digital-background-cyber-security-free-vector.jpg')] bg-cover lg:bg-center lg:bg-cover lg:bg-fixed">
      <div className="min-h-screen bg-white/10 dark:bg-black/30 mx-auto flex items-center flex-col md:flex-row justify-around py-4 md:py-0 px-4 md:px-8">
        {children}
      </div>
    </section>
  );
}
