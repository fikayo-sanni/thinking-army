import { CheckCircle } from "lucide-react"
import { AuthLayout } from "./auth-layout"
import { AuthLink } from "./auth-link"

interface SuccessStateProps {
  title: string
  message: string
  email?: string
  backLink: {
    href: string
    text: string
  }
}

export function SuccessState({ title, message, email, backLink }: SuccessStateProps) {
  return (
    <AuthLayout title="">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-2">{title}</h2>
          <p className="text-[#A0AFC0] text-sm leading-relaxed">
            {email ? (
              <>
                {message.split(email)[0]}
                <span className="text-[#00E5FF] font-medium">{email}</span>
                {message.split(email)[1]}
              </>
            ) : (
              message
            )}
          </p>
        </div>

        <AuthLink href={backLink.href} showBackIcon>
          {backLink.text}
        </AuthLink>
      </div>
    </AuthLayout>
  )
}
