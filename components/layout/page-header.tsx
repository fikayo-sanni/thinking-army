interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-medium text-[#202124] dark:text-[#E6E6E6]">
        {title}
      </h1>
      <p className="text-sm text-[#9AA0A6] dark:text-[#A0A0A0] mt-1.5">
        {description}
      </p>
    </div>
  )
}
