import { Loader2 } from 'lucide-react'

export default function AdminBookingsLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2
        className="size-9 animate-spin text-[#D4AF37]"
        aria-label="Зареждане"
      />
    </div>
  )
}
