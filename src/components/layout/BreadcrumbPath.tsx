import React, { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Check,
  FolderOpen,
  Layers,
  ArrowLeft,
} from 'lucide-react'
import { Campaign, MediaPart } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency } from '@/lib/utils'

interface BreadcrumbPathProps {
  campaigns: Campaign[]
  selectedCampaign: Campaign | null
  selectedPart: MediaPart | null
  currentView: 'campaigns' | 'campaign-detail' | 'plan'
  onSelectCampaignsList: () => void
  onSelectCampaign: (campaign: Campaign) => void
  onSelectPart: (part: MediaPart) => void
  onOpenNewCampaign: () => void
  onOpenNewPart: () => void
  onBack?: () => void
}

export const BreadcrumbPath: React.FC<BreadcrumbPathProps> = ({
  campaigns,
  selectedCampaign,
  selectedPart,
  currentView,
  onSelectCampaignsList,
  onSelectCampaign,
  onSelectPart,
  onOpenNewCampaign,
  onOpenNewPart,
  onBack,
}) => {
  const [campaignSearch, setCampaignSearch] = useState('')

  // Determine if part crumb should be shown:
  // "Článek části se v cestě ukáže, až budou části aspoň dvě."
  const hasMultipleParts = (selectedCampaign?.parts.length ?? 0) >= 2
  const showPartCrumb =
    selectedCampaign &&
    hasMultipleParts &&
    selectedPart &&
    currentView === 'plan'

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
      c.client.toLowerCase().includes(campaignSearch.toLowerCase())
  )

  return (
    <nav aria-label="Hierarchie" className="flex items-center gap-1.5 text-sm select-none">
      {/* Optional back button when navigated deep */}
      {currentView !== 'campaigns' && onBack && (
        <button
          onClick={onBack}
          className="mr-1 p-1.5 -ml-1.5 rounded-md text-[#5F5F68] hover:text-[#18181B] hover:bg-zinc-100 transition-colors"
          title="Zpět na předchozí úroveň"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}

      {/* Level 1: Kampaně with sibling dropdown */}
      <div className="flex items-center">
        <DropdownMenu>
          <div className="inline-flex items-center rounded-md hover:bg-zinc-100 transition-colors">
            <button
              onClick={onSelectCampaignsList}
              className={cn(
                "px-2 py-1 font-medium transition-colors text-left",
                currentView === 'campaigns'
                  ? "text-[#18181B] font-semibold"
                  : "text-[#5F5F68] hover:text-[#18181B]"
              )}
            >
              Kampaně
            </button>
            <DropdownMenuTrigger asChild>
              <button
                className="px-1 py-1 text-[#5F5F68] hover:text-[#18181B] transition-colors"
                title="Zobrazit sloupec kampaní"
              >
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent align="start" className="w-80 p-2">
            <DropdownMenuLabel className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs uppercase font-semibold text-[#5F5F68]">
                Sloupec: Všechny kampaně ({campaigns.length})
              </span>
              <span className="text-[11px] text-[#71717A]">výběr na vyžádání</span>
            </DropdownMenuLabel>

            {/* Quick search */}
            <div className="px-1 py-1.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Hledat kampaň nebo klienta..."
                  value={campaignSearch}
                  onChange={(e) => setCampaignSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-xs pl-8 pr-2 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-zinc-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-0.5 my-1">
              {filteredCampaigns.map((camp) => {
                const isSelected = selectedCampaign?.id === camp.id
                return (
                  <DropdownMenuItem
                    key={camp.id}
                    onClick={() => onSelectCampaign(camp)}
                    className={cn(
                      "flex items-start justify-between p-2 rounded-md cursor-pointer",
                      isSelected && "bg-zinc-100 font-medium"
                    )}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-[#18181B] truncate">
                          {camp.name}
                        </span>
                        {camp.status === 'closed' && (
                          <Badge variant="secondary" className="text-[10px] py-0 px-1">
                            uzavřená
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-[#5F5F68] truncate">
                        {camp.client} · {camp.startDate} – {camp.endDate}
                      </span>
                      <span className="text-[11px] text-zinc-400 mt-0.5">
                        {camp.parts.length === 1
                          ? '1 část (přímý plán)'
                          : `${camp.parts.length} mediální části`}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#18181B] shrink-0 mt-0.5" />
                    )}
                  </DropdownMenuItem>
                )
              })}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onOpenNewCampaign}
              className="flex items-center gap-2 text-sm font-medium text-[#18181B] p-2 text-left"
            >
              <Plus className="w-4 h-4 text-[#18181B]" />
              <span>+ Nová kampaň</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Level 2: Selected Campaign crumb */}
      {selectedCampaign && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <div className="flex items-center">
            <DropdownMenu>
              <div className="inline-flex items-center rounded-md hover:bg-zinc-100 transition-colors">
                <button
                  onClick={() => {
                    // If multiple parts, open detail view.
                    // If single part, stay/go to plan.
                    if (hasMultipleParts) {
                      onSelectCampaign(selectedCampaign)
                    }
                  }}
                  className={cn(
                    "px-2 py-1 font-medium transition-colors max-w-[200px] truncate text-left",
                    currentView === 'campaign-detail' ||
                      (!showPartCrumb && currentView === 'plan')
                      ? "text-[#18181B] font-semibold"
                      : "text-[#5F5F68] hover:text-[#18181B]"
                  )}
                  title={selectedCampaign.name}
                >
                  {selectedCampaign.name}
                </button>
                <DropdownMenuTrigger asChild>
                  <button
                    className="px-1 py-1 text-[#5F5F68] hover:text-[#18181B] transition-colors"
                    title="Přepnout sourozeneckou kampaň"
                  >
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
              </div>

              <DropdownMenuContent align="start" className="w-72 p-2">
                <DropdownMenuLabel className="px-1 text-xs text-[#5F5F68] font-semibold">
                  Přepnout kampaň (sourozenci)
                </DropdownMenuLabel>
                <div className="max-h-60 overflow-y-auto space-y-0.5 my-1">
                  {campaigns.map((camp) => (
                    <DropdownMenuItem
                      key={camp.id}
                      onClick={() => onSelectCampaign(camp)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md",
                        selectedCampaign.id === camp.id && "bg-zinc-100 font-semibold"
                      )}
                    >
                      <div className="flex flex-col truncate">
                        <span className="text-sm truncate">{camp.name}</span>
                        <span className="text-xs text-[#5F5F68] truncate">
                          {camp.client}
                        </span>
                      </div>
                      {selectedCampaign.id === camp.id && (
                        <Check className="w-4 h-4 text-[#18181B] shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onOpenNewCampaign}
                  className="flex items-center gap-2 text-sm font-medium p-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Založit jinou kampaň</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}

      {/* Level 3: Media Part crumb (ONLY IF >= 2 PARTS!) */}
      {showPartCrumb && selectedPart && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <div className="flex items-center">
            <DropdownMenu>
              <div className="inline-flex items-center rounded-md hover:bg-zinc-100 transition-colors">
                <button
                  className="px-2 py-1 font-semibold text-[#18181B] max-w-[200px] truncate text-left"
                  title={selectedPart.name}
                >
                  {selectedPart.name}
                </button>
                <DropdownMenuTrigger asChild>
                  <button
                    className="px-1 py-1 text-[#5F5F68] hover:text-[#18181B] transition-colors"
                    title="Přepnout mediální část (sourozenci)"
                  >
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
              </div>

              <DropdownMenuContent align="start" className="w-72 p-2">
                <DropdownMenuLabel className="px-1 text-xs text-[#5F5F68] font-semibold">
                  Sloupec částí: {selectedCampaign?.name}
                </DropdownMenuLabel>
                <div className="max-h-60 overflow-y-auto space-y-0.5 my-1">
                  {selectedCampaign?.parts.map((part) => {
                    const isSelected = selectedPart.id === part.id
                    return (
                      <DropdownMenuItem
                        key={part.id}
                        onClick={() => onSelectPart(part)}
                        className={cn(
                          "flex items-start justify-between p-2 rounded-md",
                          isSelected && "bg-zinc-100 font-semibold"
                        )}
                      >
                        <div className="flex flex-col truncate pr-2">
                          <span className="text-sm truncate">{part.name}</span>
                          <span className="text-xs text-[#5F5F68]">
                            {part.status} · {formatCurrency(part.budget)}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#18181B] shrink-0 mt-0.5" />
                        )}
                      </DropdownMenuItem>
                    )
                  })}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onOpenNewPart}
                  className="flex items-center gap-2 text-sm font-medium p-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nová mediální část</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </nav>
  )
}
