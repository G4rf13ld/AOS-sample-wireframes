import React, { useState } from 'react'
import { Campaign, MediaPart } from '@/types'
import { Plus, MoreHorizontal, ArrowRight, AlertCircle, Lock, Calendar, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface CampaignDetailViewProps {
  campaign: Campaign
  onSelectPart: (part: MediaPart) => void
  onOpenNewPart: () => void
  onUpdateCampaign?: (updated: Campaign) => void
}

export const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onSelectPart,
  onOpenNewPart,
  onUpdateCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'parts' | 'details'>('parts')

  // Form states for "Údaje kampaně"
  const [name, setName] = useState(campaign.name)
  const [client, setClient] = useState(campaign.client)
  const [goal, setGoal] = useState(campaign.goal)
  const [startDate, setStartDate] = useState(campaign.startDate)
  const [endDate, setEndDate] = useState(campaign.endDate)
  const [totalBudget, setTotalBudget] = useState(campaign.totalBudget.toString())
  const [responsiblePerson, setResponsiblePerson] = useState(campaign.responsiblePerson)
  const [changeReason, setChangeReason] = useState('')
  const [brand, setBrand] = useState(campaign.brand || 'Nordia')
  const [productLine, setProductLine] = useState(campaign.productLine || 'Mléčné produkty')
  const [poNumber, setPoNumber] = useState(campaign.poNumber || '4500012345')
  const [note, setNote] = useState(campaign.note || '')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Calculate budget stats
  const totalAllocatedToParts = campaign.parts.reduce((sum, p) => sum + p.budget, 0)
  const remainingToAllocate = Math.max(0, campaign.totalBudget - totalAllocatedToParts)

  const totalSpent = campaign.parts.reduce((sum, p) => {
    return sum + p.items.reduce((acc, i) => acc + i.clientCost, 0)
  }, 0)
  const remainingTotalBudget = Math.max(0, campaign.totalBudget - totalSpent)
  const progressPct = Math.min(100, Math.round((totalSpent / campaign.totalBudget) * 100))

  const handleSaveCampaign = () => {
    if (onUpdateCampaign) {
      onUpdateCampaign({
        ...campaign,
        name,
        client,
        goal,
        startDate,
        endDate,
        totalBudget: Number(totalBudget.replace(/\s/g, '')) || campaign.totalBudget,
        responsiblePerson,
        brand,
        productLine,
        poNumber,
        note,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col">
      {/* Top Banner / Summary */}
      <div className="px-8 pt-8 pb-4 border-b border-[#EBEBED]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-[#18181B]">
              {campaign.name}
            </h1>
            <div className="text-sm text-[#5F5F68]">
              {campaign.client} · {campaign.startDate} – {campaign.endDate}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-8">
            <div className="flex flex-col gap-1.5 w-52">
              <span className="text-xs text-[#5F5F68]">Zbývá z rozpočtu kampaně</span>
              <div className="text-2xl font-semibold tracking-tight text-[#18181B] tabular-nums">
                {formatCurrency(remainingTotalBudget)}
              </div>
              <div className="h-1 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-[#A14F00] rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="default">
                Více
              </Button>
              <Button onClick={onOpenNewPart} className="gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Nová mediální část</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-7 mt-6 border-b border-transparent -mb-px">
          <button
            onClick={() => setActiveTab('parts')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'parts'
                ? 'border-[#18181B] text-[#18181B] font-semibold'
                : 'border-transparent text-[#5F5F68] hover:text-[#18181B]'
            }`}
          >
            Mediální části ({campaign.parts.length})
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'details'
                ? 'border-[#18181B] text-[#18181B] font-semibold'
                : 'border-transparent text-[#5F5F68] hover:text-[#18181B]'
            }`}
          >
            Údaje kampaně
          </button>
        </div>
      </div>

      {/* Tab 1: Mediální části */}
      {activeTab === 'parts' && (
        <div className="p-8 max-w-5xl">
          <div className="flex flex-col divide-y divide-[#EBEBED] border border-[#EBEBED] rounded-xl bg-white shadow-xs overflow-hidden">
            {campaign.parts.map((part) => {
              const partSpent = part.items.reduce((sum, item) => sum + item.clientCost, 0)
              const remaining = part.budget - partSpent
              const isOverBudget = remaining < 0
              const isCancelled = part.status === 'Stornovaná'

              return (
                <div
                  key={part.id}
                  onClick={() => onSelectPart(part)}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors cursor-pointer group ${
                    isCancelled ? 'bg-zinc-50/60 opacity-60' : 'hover:bg-[#F9F9FA]'
                  }`}
                >
                  {/* Left part info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-base text-[#18181B] group-hover:text-blue-600 transition-colors">
                        {part.name}
                      </span>
                    </div>
                    <div className="text-xs text-[#5F5F68]">
                      {part.status}
                      {part.totalCount ? ` · ${part.confirmedCount ?? 0} z ${part.totalCount} potvrzeno` : ''}
                      {` · ${part.responsiblePerson}`}
                    </div>
                  </div>

                  {/* Date range representation */}
                  <div className="w-48 text-xs text-[#5F5F68] hidden lg:block">
                    <div>{part.startDate} – {part.endDate}</div>
                    <div className="h-1.5 w-32 bg-zinc-200 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-zinc-600 w-3/4 rounded-full" />
                    </div>
                  </div>

                  {/* Budget remaining / over budget */}
                  <div className="text-right w-40">
                    {isCancelled ? (
                      <span className="text-xs text-[#71717A] italic">nepočítá se</span>
                    ) : isOverBudget ? (
                      <div>
                        <div className="text-xs text-red-600 font-medium">Přes rozpočet</div>
                        <div className="text-sm font-semibold text-red-600 tabular-nums">
                          +{formatCurrency(Math.abs(remaining))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs text-[#5F5F68]">Zbývá</div>
                        <div className="text-sm font-semibold text-[#18181B] tabular-nums">
                          {formatCurrency(remaining)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Open action */}
                  <div className="shrink-0 flex items-center justify-end pl-2">
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-[#18181B] flex items-center gap-1">
                      Mediaplán <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="mt-4 flex items-center justify-between text-xs text-[#5F5F68]">
            <span>
              Zbývá rozdělit do částí {formatCurrency(remainingToAllocate)}
            </span>
            <button className="text-[#5F5F68] hover:text-[#18181B] underline underline-offset-2">
              Archiv
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Údaje kampaně (Recreating Kampan-udaje.dc.html) */}
      {activeTab === 'details' && (
        <div className="p-8 max-w-2xl">
          <div className="space-y-6">
            {/* Warning banner about locked fields */}
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-950">
                  Měníš konec kampaně z 30. 4. na 9. 5. 2027
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  Termíny mediálních částí se prodloužením nemění. Online 1 má 5 odeslaných rezervací, jejich termíny zůstávají.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Název kampaně <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-white text-sm focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#18181B] mb-1.5">
                    <span>Odběratel</span>
                    <span className="text-red-500">*</span>
                    <span className="text-[11px] text-[#5F5F68] flex items-center gap-0.5 ml-1">
                      <Lock className="w-3 h-3" /> zamčené
                    </span>
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-zinc-50 text-sm text-[#18181B] focus:outline-none focus:border-[#18181B]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#18181B] mb-1.5">
                    <span>Cíl kampaně</span>
                    <span className="text-red-500">*</span>
                    <span className="text-[11px] text-[#5F5F68] flex items-center gap-0.5 ml-1">
                      <Lock className="w-3 h-3" /> zamčené
                    </span>
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-zinc-50 text-sm text-[#18181B] focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#18181B] mb-1.5">
                    <span>Začátek</span>
                    <span className="text-red-500">*</span>
                    <span className="text-[11px] text-[#5F5F68] flex items-center gap-0.5 ml-1">
                      <Lock className="w-3 h-3" /> zamčené
                    </span>
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-zinc-50 text-sm text-[#18181B] focus:outline-none focus:border-[#18181B]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#18181B] mb-1.5">
                    <span>Konec</span>
                    <span className="text-red-500">*</span>
                    <span className="text-[11px] text-[#5F5F68] flex items-center gap-0.5 ml-1">
                      <Lock className="w-3 h-3" /> zamčené
                    </span>
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-zinc-50 text-sm text-[#18181B] focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#18181B] mb-1.5">
                    <span>Rozpočet</span>
                    <span className="text-red-500">*</span>
                    <span className="text-[11px] text-[#5F5F68] flex items-center gap-0.5 ml-1">
                      <Lock className="w-3 h-3" /> zamčené
                    </span>
                  </label>
                  <input
                    type="text"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-zinc-50 text-sm text-[#18181B] focus:outline-none focus:border-[#18181B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                    Odpovědná osoba <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-white text-sm focus:outline-none focus:border-[#18181B]"
                  >
                    <option>Jana Nováková</option>
                    <option>Pavel Dvořák</option>
                    <option>Petr Svoboda</option>
                  </select>
                </div>
              </div>

              {/* Důvod změny */}
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Důvod změny <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Zapíše se do historie kampaně..."
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-white text-sm focus:outline-none focus:border-[#18181B]"
                />
              </div>

              {/* Další údaje */}
              <div className="pt-4 border-t border-[#EBEBED] space-y-4">
                <h3 className="text-sm font-semibold text-[#18181B]">Další údaje</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5F5F68] mb-1">Značka</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#D4D4D8] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5F5F68] mb-1">Produkt / řada</label>
                    <input
                      type="text"
                      value={productLine}
                      onChange={(e) => setProductLine(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#D4D4D8] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5F5F68] mb-1">Objednávka odběratele (PO)</label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#D4D4D8] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5F5F68] mb-1">Poznámka</label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#D4D4D8] text-sm"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-[#EBEBED] flex items-center justify-between">
                <div className="text-xs text-[#5F5F68]">
                  Zamčená pole jdou změnit jen s důvodem.
                </div>
                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Uloženo
                    </span>
                  )}
                  <Button onClick={handleSaveCampaign}>
                    Uložit změny
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
