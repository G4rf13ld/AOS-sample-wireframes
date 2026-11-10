import React from 'react'
import {
  Layers,
  Tv,
  Users,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  activeModule?: string
  onSelectModule?: (mod: string) => void
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeModule = 'kampane',
  onSelectModule,
}) => {
  const menuItems = [
    { id: 'kampane', label: 'Kampaně', icon: Layers, count: 4 },
    { id: 'media', label: 'Média & Ceníky', icon: Tv },
    { id: 'klienti', label: 'Klienti', icon: Users },
    { id: 'finance', label: 'Finance & PO', icon: DollarSign },
    { id: 'nastaveni', label: 'Nastavení', icon: Settings },
  ]

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "h-screen bg-[#FBFBFC] border-r border-[#EBEBED] flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 select-none z-30",
          isCollapsed ? "w-14" : "w-56"
        )}
      >
        {/* Top: Logo / App Name */}
        <div>
          <div
            className={cn(
              "h-14 flex items-center border-b border-[#EBEBED] px-3.5",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-md bg-[#18181B] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-sm">
                AOS
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-semibold text-sm tracking-tight text-[#18181B] leading-tight">
                    AOS Media
                  </span>
                  <span className="text-[10px] text-[#5F5F68] font-medium tracking-wide uppercase">
                    Planning OS
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeModule === item.id

              const buttonContent = (
                <button
                  key={item.id}
                  onClick={() => onSelectModule?.(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all group relative",
                    isCollapsed ? "h-10 justify-center px-0" : "h-10 px-3",
                    isActive
                      ? "bg-[#EDEDEF] text-[#18181B] font-semibold"
                      : "text-[#5F5F68] hover:text-[#18181B] hover:bg-[#F4F4F5]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-[#18181B]" : "text-[#71717A] group-hover:text-[#18181B]"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && item.count && (
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                      {item.count}
                    </span>
                  )}
                </button>
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.count && (
                          <span className="text-[10px] px-1 rounded bg-zinc-700 text-zinc-100">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return buttonContent
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-2 border-t border-[#EBEBED]">
          {/* Collapse/Expand Toggle */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "w-full h-9 flex items-center gap-2.5 rounded-lg text-xs font-medium text-[#5F5F68] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors",
              isCollapsed ? "justify-center px-0" : "px-3"
            )}
            title={isCollapsed ? "Rozbalit panel" : "Sbalit na ikony"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Sbalit menu</span>
              </>
            )}
          </button>

          {/* User profile avatar */}
          <div
            className={cn(
              "mt-2 pt-2 border-t border-[#EBEBED] flex items-center gap-2.5",
              isCollapsed ? "justify-center" : "px-2"
            )}
          >
            <div className="w-7 h-7 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-700 flex items-center justify-center text-xs font-semibold shrink-0">
              JN
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#18181B] truncate">
                  Jana Nováková
                </span>
                <span className="text-[10px] text-[#5F5F68] truncate">
                  Media Planner
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
