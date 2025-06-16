interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white uppercase tracking-wide">{title}</h1>
      <p className="text-[#A0AFC0] mt-2">{description}</p>
    </div>
  )
}
