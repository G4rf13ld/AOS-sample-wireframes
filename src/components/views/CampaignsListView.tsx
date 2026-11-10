import React, { useState } from 'react'
import { Campaign } from '@/types'
import { Plus, Search, Calendar, DollarSign, Layers, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface CampaignsListViewProps {
  campaigns: Campaign[]
  onSelectCampaign: (campaign: Campaign) => void
  onOpenNewCampaign: () => void
}

export const CampaignsListView: React.FC<CampaignsListViewProps> = ({
  campaigns,
  onSelectCampaign,
  onOpenNewCampaign,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all')

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ? true : c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#18181B]">
            Kampaně
          </h1>
          <p className="text-sm text-[#5F5F68] mt-1">
            Přehled všech marketingových a mediálních kampaní
          </p>
        </div>

        <Button onClick={onOpenNewCampaign} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Nová kampaň</span>
        </Button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Hledat podle názvu nebo klienta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#D4D4D8] bg-white text-sm focus:outline-none focus:border-[#18181B]"
          />
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#5F5F68] hover:text-[#18181B]'
            }`}
          >
            Všechny ({campaigns.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              statusFilter === 'active'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#5F5F68] hover:text-[#18181B]'
            }`}
          >
            Aktivní ({campaigns.filter((c) => c.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('closed')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              statusFilter === 'closed'
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#5F5F68] hover:text-[#18181B]'
            }`}
          >
            Uzavřené ({campaigns.filter((c) => c.status === 'closed').length})
          </button>
        </div>
      </div>

      {/* Campaigns Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map((camp) => {
          const isSinglePart = camp.parts.length === 1
          const totalSpent = camp.parts.reduce((sum, p) => {
            const partSpent = p.items.reduce((acc, i) => acc + i.clientCost, 0)
            return sum + partSpent
          }, 0)
          const remainingBudget = Math.max(0, camp.totalBudget - totalSpent)
          const budgetPct = Math.min(100, Math.round((totalSpent / camp.totalBudget) * 100))

          return (
            <div
              key={camp.id}
              onClick={() => onSelectCampaign(camp)}
              className="group p-5 rounded-xl border border-[#D4D4D8] hover:border-[#18181B] bg-white transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-lg text-[#18181B] group-hover:text-zinc-900 transition-colors">
                    {camp.name}
                  </h2>
                  {camp.status === 'closed' ? (
                    <Badge variant="secondary">uzavřená</Badge>
                  ) : (
                    <Badge variant="success">aktivní</Badge>
                  )}
                </div>

                <p className="text-sm text-[#5F5F68] mb-4">
                  {camp.client} · {camp.startDate} – {camp.endDate}
                </p>

                {/* Progress / Budget */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs text-[#5F5F68]">
                    <span>Rozpočet kampaně</span>
                    <span className="font-medium text-[#18181B]">
                      {formatCurrency(camp.totalBudget)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full transition-all"
                      style={{ width: `${budgetPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#5F5F68]">
                    <span>Vyčerpáno {budgetPct} %</span>
                    <span>Zbývá {formatCurrency(remainingBudget)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="pt-3 border-t border-[#EBEBED] flex items-center justify-between text-xs text-[#5F5F68]">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {isSinglePart ? (
                    <span className="text-emerald-700 font-medium">
                      1 část · přímý plán ⚡
                    </span>
                  ) : (
                    <span>{camp.parts.length} mediální části</span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#18181B] group-hover:translate-x-0.5 transition-transform">
                  Otevřít <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
