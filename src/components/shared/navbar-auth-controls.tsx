'use client'

import { LogOut, PanelRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/lib/auth-context'

export function NavbarAuthControls() {
  const { user, logout } = useAuth()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-md text-white hover:bg-white/10 hover:text-white"
          aria-label="Open account panel"
        >
          <PanelRight className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col border-slate-200 bg-white sm:max-w-sm">
        <SheetHeader className="sr-only">
          <SheetTitle>Signed-in account</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 px-4 pb-4 pt-2">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
            <Avatar className="h-12 w-12 border border-slate-200">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-slate-200 text-[#0f172a]">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0f172a]">{user?.name || 'Signed in'}</p>
              <p className="truncate text-xs text-[#64748b]">{user?.email}</p>
            </div>
          </div>
        </div>
        <SheetFooter className="border-t border-slate-100 sm:flex-col">
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-200 text-[#0f172a] hover:bg-slate-50"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
