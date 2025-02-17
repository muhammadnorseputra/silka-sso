interface Props {
  readonly children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="bg-[url('https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/lowershape-powerapps-md?resMode=sharp2&op_usm=1.5,0.65,15,0&wid=1600&hei=1469&qlt=100&fit=constrain')] bg-cover lg:bg-center lg:bg-cover lg:bg-fixed">
      <div className="min-h-screen bg-white/10 dark:bg-black/30 mx-auto flex items-center flex-col md:flex-row justify-around py-4 md:py-0 px-4 md:px-8">
        {children}
      </div>
    </section>
  );
}
