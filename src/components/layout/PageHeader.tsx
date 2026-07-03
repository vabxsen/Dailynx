type Props = {
  title: string;
  subtitle?: string;
};

function PageHeader({ title, subtitle }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
    </div>
  );
}

export default PageHeader;
