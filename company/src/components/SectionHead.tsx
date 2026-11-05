type Props = {
  label: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  dark?: boolean;
  as?: "h1" | "h2";
};

export default function SectionHead({ label, title, lead, dark = false, as: Heading = "h2" }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p className={`font-mono text-[13px] font-semibold ${dark ? "tracking-wider text-on-dark-subtle" : "text-accent"}`}>
        {label}
      </p>
      <Heading className="text-3xl leading-snug font-bold sm:text-4xl">{title}</Heading>
      {lead && <p className={`max-w-2xl text-[17px] leading-relaxed ${dark ? "text-on-dark" : "text-mid"}`}>{lead}</p>}
    </div>
  );
}
