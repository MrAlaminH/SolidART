import { useState, useCallback } from "react"

import { Toast } from "@/components/ui/toast"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ ...props }: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1))
    }, props.duration || 5000)
  }, [])

  return { toast, toasts }
}