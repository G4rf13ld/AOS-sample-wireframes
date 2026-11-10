import React, { useState } from 'react'
import { Campaign, MediaPart } from '@/types'
import { Plus, Check, ArrowRight } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { WEEKS } from '@/data/mockData'

interface MillerColumnsViewProps {
  campaigns: Campaign[]
  selectedCampaign: Campaign | null
  selectedPart: MediaPart | null
  onSelectCampaign: (campaign: Campaign) => void
  onSelectPart: (part: MediaPart) => void
  onOpenNewCampaign: () => void
  onOpenNewPart: () => void
}

export const MillerColumnsView: React.FC<MillerColumnsViewProps> = ({
  campaigns,
  selectedCampaign,
  selectedPart,
  onSelectCampaign,
  onSelectPart,
  onOpenNewCampaign,
  onOpenNewPart,
}) => {
  const currentCampaign = selectedCampaign || campaigns[0]
  const currentPart = selectedPart || currentCampaign?.parts[0] || null

  const [inlineNewPartName, setInlineNewPartName] = useState('Online 3')
  const [inlineBudget, setInlineBudget] = useState('200 000')

  const totalPartSpent = currentPart?.items.reduce((acc, i) => acc + i.clientCost, 0) || 0
  const remainingPartBudget = currentPart ? currentPart.budget - totalPartSpent : 0

  return (
    <div className="flex-1 flex overflow-hidden bg-white text-[#18181B]">
      {/* Column 1: Kampaně */}
      <div className="w-72 border-r border-[#D4D4D8] p-5 flex flex-col gap-1 overflow-y-auto shrink-0 bg-white">
        <h2 className="text-xs font-semibold text-[#5F5F68] uppercase tracking-wider mb-2 px-3">
          Kampaně
        </h2>

        {campaigns.map((camp) => {
          const isSelected = currentCampaign?.id === camp.id
          return (
            <button
              key={camp.id}
              onClick={() => onSelectCampaign(camp)}
              className={`p-3 rounded-lg text-left transition-all flex flex-col gap-0.5 ${
                isSelected
                  ? 'bg-[#EDEDEF] text-[#18181B] font-semibold'
                  : 'text-[#18181B] hover:bg-zinc-100'
              }`}
            >
              <span className="text-sm font-medium">{camp.name}</span>
              <span className="text-xs text-[#5F5F68]">
                {camp.client} · {camp.startDate.slice(0, -5)} – {camp.endDate.slice(0, -5)}
              </span>
            </button>
          )
        })}

        <button
          onClick={onOpenNewCampaign}
          className="mt-2 px-3 py-2 text-left text-sm font-medium text-[#18181B] hover:text-zinc-600 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nová kampaň</span>
        </button>
      </div>

      {/* Column 2: Mediální části */}
      <div className="w-76 border-r border-[#D4D4D8] p-5 flex flex-col gap-1 overflow-y-auto shrink-0 bg-[#FAFAFA]">
        <h2 className="text-xs font-semibold text-[#5F5F68] uppercase tracking-wider mb-2 px-3">
          Mediální části
        </h2>

        {currentCampaign?.parts.map((part) => {
          const isSelected = currentPart?.id === part.id
          const partSpent = part.items.reduce((s, i) => s + i.clientCost, 0)
          const remaining = part.budget - partSpent

          return (
            <button
              key={part.id}
              onClick={() => onSelectPart(part)}
              className={`p-3 rounded-lg text-left transition-all flex flex-col gap-0.5 ${
                isSelected
                  ? 'bg-white shadow-xs border border-zinc-200 text-[#18181B] font-semibold'
                  : 'text-[#18181B] hover:bg-zinc-200/50'
              }`}
            >
              <span className="text-sm font-medium">{part.name}</span>
              <span className="text-xs text-[#5F5F68]">
                {remaining < 0
                  ? `přes o ${formatCurrency(Math.abs(remaining))}`
                  : part.items.length === 0
                  ? 'bez položek'
                  : `zbývá ${formatCurrency(remaining)}`}
              </span>
            </button>
          )
        })}

        {/* Inline Add Part Form (from wireframe 3) */}
        <div className="mt-3 p-3 rounded-lg border border-[#D4D4D8] bg-white flex flex-col gap-2 text-xs">
          <label className="text-[#5F5F68] font-medium">Nová část</label>
          <input
            type="text"
            value={inlineNewPartName}
            onChange={(e) => setInlineNewPartName(e.target.value)}
            className="w-full h-9 px-2.5 rounded-md border border-[#D4D4D8] text-xs"
          />

          <label className="text-[#5F5F68] font-medium mt-1">
            Rozpočet · zbývá rozdělit 200 000 Kč
          </label>
          <input
            type="text"
            value={inlineBudget}
            onChange={(e) => setInlineBudget(e.target.value)}
            className="w-full h-9 px-2.5 rounded-md border border-[#D4D4D8] text-xs"
          />

          <button
            onClick={onOpenNewPart}
            className="mt-1 h-9 rounded-md bg-[#18181B] text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            Přidat část
          </button>
        </div>
      </div>

      {/* Column 3: Mediaplán Detail table */}
      <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col">
        {currentPart ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBEBED]">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
                  {currentPart.name}
                </h1>
                <p className="text-xs text-[#5F5F68]">
                  {currentPart.startDate} – {currentPart.endDate} · {currentPart.status}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#5F5F68]">Zbývá z rozpočtu části</span>
                <div className="text-xl font-bold text-[#18181B] tabular-nums">
                  {formatCurrency(remainingPartBudget)}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="border border-[#EBEBED] rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FBFBFC] text-[#5F5F68] border-b border-[#EBEBED]">
                    <th className="py-2.5 px-3 text-left font-semibold">Položka</th>
                    <th className="py-2.5 px-3 text-left font-semibold">Tvar po týdnech</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Celkem</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Client cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBED]">
                  {currentPart.items.map((it) => (
                    <tr key={it.id} className="hover:bg-zinc-50">
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#18181B]">{it.name}</div>
                        <div className="text-[11px] text-[#5F5F68]">{it.subtext}</div>
                      </td>
                      <td className="py-3 px-3">
                        {it.format === 'fix' ? (
                          <span className="text-zinc-400">bez objemu</span>
                        ) : (
                          <div className="flex items-end gap-1 h-5">
                            {WEEKS.map((w) => {
                              const amt = it.weeklyAmounts[w.id] || 0
                              return (
                                <div
                                  key={w.id}
                                  className={`w-3 rounded-xs ${
                                    amt > 0 ? 'bg-[#9E9EA4]' : 'bg-[#E4E4E7]'
                                  }`}
                                  style={{ height: amt > 0 ? '100%' : '15%' }}
                                />
                              )
                            })}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums">
                        {it.format === 'fix' ? '–' : `${formatNumber(it.totalAmount)} ${it.format}`}
                      </td>
                      <td className="py-3 px-3 text-right font-medium tabular-nums">
                        {formatCurrency(it.clientCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-[#5F5F68]">
            Vyberte mediální část v levém sloupci
          </div>
        )}
      </div>
    </div>
  )
}
