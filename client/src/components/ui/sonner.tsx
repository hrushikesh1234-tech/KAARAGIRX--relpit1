'use client'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      toastOptions={{
        className: 'toast group',
        classNames: {
          toast: 'group toast group-[.toast]',
          title: 'text-sm font-medium',
          description: 'text-sm opacity-90',
          actionButton: 'group-[.toast]:bg-blue-500 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-gray-500 group-[.toast]:text-white',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
