import React from 'react'
import { BreadcrumbPath } from './BreadcrumbPath'
import { Campaign, MediaPart } from '@/types'
import { Columns, Eye, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
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
  viewMode: 'collapsed-path' | 'miller-columns'
  onToggleViewMode: (mode: 'collapsed-path' | 'miller-columns') => void
}

export const Header: React.FC<HeaderProps> = ({
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
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <header className="h-14 border-b border-[#EBEBED] bg-white px-6 flex items-center justify-between gap-4 shrink-0 z-20">
      {/* Left: Breadcrumb Path */}
      <div className="flex items-center gap-3 overflow-hidden">
        <BreadcrumbPath
          campaigns={campaigns}
          selectedCampaign={selectedCampaign}
          selectedPart={selectedPart}
          currentView={currentView}
          onSelectCampaignsList={onSelectCampaignsList}
          onSelectCampaign={onSelectCampaign}
          onSelectPart={onSelectPart}
          onOpenNewCampaign={onOpenNewCampaign}
          onOpenNewPart={onOpenNewPart}
          onBack={onBack}
        />
      </div>

      {/* Right: View Mode Toggle & User info */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Toggle between "Sloupce v cestě" and "3 Sloupce vedle sebe" */}
        <div className="hidden md:flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs">
          <button
            onClick={() => onToggleViewMode('collapsed-path')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === 'collapsed-path'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#5F5F68] hover:text-[#18181B]'
            }`}
            title="Sloupce sbalené do cesty podle zadání"
          >
            Sbalené do cesty
          </button>
          <button
            onClick={() => onToggleViewMode('miller-columns')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === 'miller-columns'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#5F5F68] hover:text-[#18181B]'
            }`}
            title="3 Sloupce vedle sebe (Přístup 3 z wireframe)"
          >
            3 Sloupce vedle sebe
          </button>
        </div>

        <div className="text-xs text-[#5F5F68] border-l border-zinc-200 pl-4 flex items-center gap-2">
          <span>Jana Nováková</span>
        </div>
      </div>
    </header>
  )
}
