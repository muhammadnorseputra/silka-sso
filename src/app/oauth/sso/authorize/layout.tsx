interface Props {
  readonly children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="bg-[url('https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/619195-getstarted?resMode=sharp2&op_usm=1.5,0.65,15,0&wid=3201&hei=1380&qlt=100&fit=constrain')] bg-cover lg:bg-center lg:bg-cover lg:bg-fixed">
      <div>{children}</div>
    </section>
  );
}
