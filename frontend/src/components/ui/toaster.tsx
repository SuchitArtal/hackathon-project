"use client"

import { useToast } from "@/hooks/use-toast"
import { Toast, ToastDescription } from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(({ id, title, description, action, type, ...props }) => (
        <Toast
          key={id}
          {...props}
          title={title}
          variant={type === 'error' ? 'destructive' : 'default'}
        >
          {description && <ToastDescription>{description}</ToastDescription>}
          {action && (
            <button
              className="inline-flex h-8 items-center justify-center rounded-md border border-transparent bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
        </Toast>
      ))}
    </div>
  )
}
