import React, { useState } from 'react'
import { Campaign, MediaPart, PlanItem, WeekColumn } from '@/types'
import { WEEKS } from '@/data/mockData'
import {
  Plus,
  MoreHorizontal,
  Check,
  Send,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface MediaPlanViewProps {
  campaign: Campaign
  part: MediaPart
  onUpdatePart?: (updatedPart: MediaPart) => void
  onOpenEditModal?: () => void
}

export const MediaPlanView: React.FC<MediaPlanViewProps> = ({
  campaign,
  part,
  onUpdatePart,
  onOpenEditModal,
}) => {
  const [mainTab, setMainTab] = useState<'plan' | 'details'>('plan')
  const [subView, setSubView] = useState<'planning' | 'overview'>('planning')
  const [unitMode, setUnitMode] = useState<'pieces' | 'percent'>('pieces')
  const [items, setItems] = useState<PlanItem[]>(part.items)

  // Edit Part Form state (when on "Údaje části" tab)
  const [partName, setPartName] = useState(part.name)
  const [partBudget, setPartBudget] = useState(part.budget.toString())
  const [inheritDates, setInheritDates] = useState(part.inheritDates)
  const [partStartDate, setPartStartDate] = useState(part.startDate)
  const [partEndDate, setPartEndDate] = useState(part.endDate)
  const [partPo, setPartPo] = useState(part.poNumber)
  const [partResp, setPartResp] = useState(part.responsiblePerson)
  const [partNote, setPartNote] = useState(part.note || '')
  const [detailsSaved, setDetailsSaved] = useState(false)

  // Calculations
  const totalClientCost = items.reduce((sum, item) => sum + item.clientCost, 0)
  const remainingBudget = part.budget - totalClientCost
  const totalImpressions = items.reduce((sum, item) => sum + item.totalAmount, 0)
  const costWithVat = Math.round(totalClientCost * 1.21)

  // Update cell in weekly table
  const handleWeeklyAmountChange = (
    itemId: string,
    weekId: string,
    newValue: number
  ) => {
    const updated = items.map((item) => {
      if (item.id === itemId) {
        const newWeekly = { ...item.weeklyAmounts, [weekId]: newValue }
        // recalc total
        const newTotal = Object.values(newWeekly).reduce((a, b) => a + (b || 0), 0)
        return {
          ...item,
          weeklyAmounts: newWeekly,
          totalAmount: newTotal,
        }
      }
      return item
    })
    setItems(updated)
    if (onUpdatePart) {
      onUpdatePart({ ...part, items: updated })
    }
  }

  // Handle saving details
  const handleSaveDetails = (andOpenPlan: boolean = false) => {
    const updated: MediaPart = {
      ...part,
      name: partName,
      budget: Number(partBudget.replace(/\s/g, '')) || part.budget,
      inheritDates,
      startDate: partStartDate,
      endDate: partEndDate,
      poNumber: partPo,
      responsiblePerson: partResp,
      note: partNote,
      items,
    }
    if (onUpdatePart) {
      onUpdatePart(updated)
    }
    setDetailsSaved(true)
    setTimeout(() => setDetailsSaved(false), 2500)
    if (andOpenPlan) {
      setMainTab('plan')
    }
  }

  // Group items by category
  const categories: ('Awareness' | 'Výkon' | 'Ostatní')[] = ['Awareness', 'Výkon', 'Ostatní']

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col">
      {/* Top Part Header from wireframe */}
      <div className="px-8 pt-7 pb-4 border-b border-[#EBEBED]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-tight text-[#18181B]">
              {part.name}
            </h1>
            <div className="text-sm text-[#5F5F68]">
              {part.startDate} – {part.endDate} · {part.status}
              {part.totalCount ? `, ${part.confirmedCount ?? 0} z ${part.totalCount} potvrzeno` : ''}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-8">
            <div className="flex flex-col gap-1.5 w-52">
              <span className="text-xs text-[#5F5F68]">Zbývá z rozpočtu části</span>
              <div
                className={`text-2xl font-semibold tracking-tight tabular-nums ${
                  remainingBudget < 0 ? 'text-red-600' : 'text-[#18181B]'
                }`}
              >
                {remainingBudget < 0 ? `+${formatCurrency(Math.abs(remainingBudget))}` : formatCurrency(remainingBudget)}
              </div>
              <div className="h-1 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-[#A14F00] rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((totalClientCost / part.budget) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#71717A] mr-1 hidden sm:inline">Uloženo 9:42</span>
              <Button variant="outline" size="default">
                Více
              </Button>
              <Button size="default">
                Hotovo
              </Button>
            </div>
          </div>
        </div>

        {/* Level 1 Tabs: Mediaplán vs Údaje části */}
        <div className="flex gap-7 mt-6 border-b border-transparent -mb-px">
          <button
            onClick={() => setMainTab('plan')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              mainTab === 'plan'
                ? 'border-[#18181B] text-[#18181B] font-semibold'
                : 'border-transparent text-[#5F5F68] hover:text-[#18181B]'
            }`}
          >
            Mediaplán
          </button>
          <button
            onClick={() => setMainTab('details')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              mainTab === 'details'
                ? 'border-[#18181B] text-[#18181B] font-semibold'
                : 'border-transparent text-[#5F5F68] hover:text-[#18181B]'
            }`}
          >
            Údaje části
          </button>
        </div>
      </div>

      {/* Main Tab 1: Mediaplán (Table / Grid) */}
      {mainTab === 'plan' && (
        <div className="flex-1 flex flex-col p-8 overflow-x-auto">
          {/* Controls bar: Sub-view (Přehled / Plánování) + Units (Kusy / %) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-1 p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 text-xs">
              <button
                onClick={() => setSubView('overview')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  subView === 'overview'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#5F5F68] hover:text-[#18181B]'
                }`}
              >
                Přehled
              </button>
              <button
                onClick={() => setSubView('planning')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  subView === 'planning'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#5F5F68] hover:text-[#18181B]'
                }`}
              >
                Plánování po týdnech
              </button>
            </div>

            {subView === 'planning' && (
              <div className="flex items-center gap-1 p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 text-xs">
                <button
                  onClick={() => setUnitMode('pieces')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    unitMode === 'pieces'
                      ? 'bg-white text-[#18181B] shadow-xs'
                      : 'text-[#5F5F68] hover:text-[#18181B]'
                  }`}
                >
                  Kusy
                </button>
                <button
                  onClick={() => setUnitMode('percent')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    unitMode === 'percent'
                      ? 'bg-white text-[#18181B] shadow-xs'
                      : 'text-[#5F5F68] hover:text-[#18181B]'
                  }`}
                >
                  %
                </button>
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="border border-[#EBEBED] rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EBEBED] bg-[#FBFBFC] text-[#5F5F68]">
                  <th className="py-3 px-4 font-semibold text-xs min-w-[240px]">
                    Položka
                  </th>

                  {subView === 'overview' ? (
                    <th className="py-3 px-3 font-semibold text-xs min-w-[170px]">
                      Tvar po týdnech
                    </th>
                  ) : (
                    WEEKS.map((w) => (
                      <th
                        key={w.id}
                        className="py-2.5 px-2 font-semibold text-xs text-right min-w-[85px] border-l border-[#F0F0F2]"
                      >
                        <div className="text-[11px] font-bold text-[#18181B]">{w.label}</div>
                        <div className="text-[10px] text-[#71717A] font-normal">{w.dateRange}</div>
                      </th>
                    ))
                  )}

                  <th className="py-3 px-3 font-semibold text-xs text-right min-w-[90px]">
                    Celkem
                  </th>
                  <th className="py-3 px-2 font-semibold text-xs text-right min-w-[55px]">
                    Sleva
                  </th>
                  <th className="py-3 px-2 font-semibold text-xs text-right min-w-[55px]">
                    Provize
                  </th>
                  <th className="py-3 px-3 font-semibold text-xs text-center min-w-[110px]">
                    Stav
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-right min-w-[110px]">
                    Client cost ▾
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EBEBED]">
                {categories.map((cat) => {
                  const catItems = items.filter((i) => i.category === cat)
                  if (catItems.length === 0) return null

                  const catCost = catItems.reduce((acc, i) => acc + i.clientCost, 0)

                  return (
                    <React.Fragment key={cat}>
                      {/* Category Header Row */}
                      <tr className="bg-[#F8F8F9] font-semibold text-[#18181B]">
                        <td
                          colSpan={subView === 'overview' ? 6 : WEEKS.length + 5}
                          className="py-2 px-4 text-xs font-semibold"
                        >
                          <div className="flex items-center justify-between">
                            <span>{cat}</span>
                            <span className="text-zinc-600 font-normal tabular-nums">
                              {formatCurrency(catCost)}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Items */}
                      {catItems.map((item) => {
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-zinc-50/70 transition-colors group"
                          >
                            {/* Item Name & Subtext */}
                            <td className="py-3 px-4">
                              <div className="font-medium text-[#18181B] text-sm leading-snug">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#5F5F68] mt-0.5">
                                {item.subtext}
                              </div>
                            </td>

                            {/* Center Columns: Overview bars OR Weekly cells */}
                            {subView === 'overview' ? (
                              <td className="py-3 px-3">
                                {item.format === 'fix' ? (
                                  <span className="text-zinc-400 text-xs italic">
                                    bez objemu
                                  </span>
                                ) : (
                                  /* Mini 8-week volume bar chart */
                                  <div
                                    role="img"
                                    aria-label="Rozložení objemu po týdnech"
                                    className="flex items-end gap-1 h-6"
                                  >
                                    {WEEKS.map((w) => {
                                      const amount = item.weeklyAmounts[w.id] || 0
                                      // Scale height relative to max in item
                                      const hasVal = amount > 0
                                      const heightPct = hasVal ? '100%' : '8%'
                                      return (
                                        <div
                                          key={w.id}
                                          className={`w-3.5 rounded-xs transition-all ${
                                            hasVal ? 'bg-[#9E9EA4]' : 'bg-[#E4E4E7]'
                                          }`}
                                          style={{ height: heightPct }}
                                          title={`${w.label}: ${formatNumber(amount)}`}
                                        />
                                      )
                                    })}
                                  </div>
                                )}
                              </td>
                            ) : (
                              /* Planning Weekly Columns */
                              WEEKS.map((w) => {
                                const amount = item.weeklyAmounts[w.id]
                                if (item.format === 'fix') {
                                  return (
                                    <td
                                      key={w.id}
                                      className="py-2 px-1 text-center text-zinc-300 border-l border-[#F0F0F2]"
                                    >
                                      –
                                    </td>
                                  )
                                }
                                return (
                                  <td
                                    key={w.id}
                                    className="py-2 px-1 text-right border-l border-[#F0F0F2] tabular-nums"
                                  >
                                    <input
                                      type="text"
                                      value={
                                        amount !== undefined && amount > 0
                                          ? formatNumber(amount)
                                          : '–'
                                      }
                                      onChange={(e) => {
                                        const clean = e.target.value.replace(/\D/g, '')
                                        handleWeeklyAmountChange(
                                          item.id,
                                          w.id,
                                          clean ? parseInt(clean, 10) : 0
                                        )
                                      }}
                                      className="w-full text-right text-xs py-1 px-1.5 rounded hover:bg-zinc-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                  </td>
                                )
                              })
                            )}

                            {/* Total Amount */}
                            <td className="py-3 px-3 text-right font-medium text-xs tabular-nums">
                              {item.format === 'fix'
                                ? '–'
                                : `${formatNumber(item.totalAmount)} ${item.format}`}
                            </td>

                            {/* Sleva */}
                            <td className="py-3 px-2 text-right text-xs text-[#5F5F68] tabular-nums">
                              {item.discountPct > 0 ? `${item.discountPct} %` : '–'}
                            </td>

                            {/* Provize */}
                            <td className="py-3 px-2 text-right text-xs text-[#5F5F68] tabular-nums">
                              {item.commissionPct > 0 ? `${item.commissionPct} %` : '–'}
                            </td>

                            {/* Stav */}
                            <td className="py-3 px-3 text-center">
                              {item.status === 'Rezervováno' && (
                                <Badge variant="success" className="text-[11px] font-normal">
                                  Rezervováno
                                </Badge>
                              )}
                              {item.status === 'Rezervace odeslána' && (
                                <Badge variant="warning" className="text-[11px] font-normal">
                                  Odesláno
                                </Badge>
                              )}
                              {item.status === 'Koncept' && (
                                <Badge variant="secondary" className="text-[11px] font-normal">
                                  Koncept
                                </Badge>
                              )}
                              {item.status === 'Schváleno' && (
                                <Badge variant="info" className="text-[11px] font-normal">
                                  Schváleno
                                </Badge>
                              )}
                              {item.status === 'Objednáno' && (
                                <Badge variant="default" className="text-[11px] font-normal">
                                  Objednáno
                                </Badge>
                              )}
                            </td>

                            {/* Client cost */}
                            <td className="py-3 px-4 text-right font-medium text-xs text-[#18181B] tabular-nums">
                              {formatCurrency(item.clientCost)}
                            </td>
                          </tr>
                        )
                      })}
                    </React.Fragment>
                  )
                })}

                {/* Add Item row */}
                <tr className="hover:bg-zinc-50">
                  <td
                    colSpan={subView === 'overview' ? 7 : WEEKS.length + 6}
                    className="py-2.5 px-4"
                  >
                    <button className="flex items-center gap-1.5 text-xs font-medium text-[#18181B] hover:text-zinc-600">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Přidat položku</span>
                    </button>
                  </td>
                </tr>

                {/* Totals row */}
                <tr className="bg-[#F8F8F9] font-semibold text-[#18181B] border-t-2 border-zinc-200">
                  <td className="py-3 px-4 text-xs font-semibold">
                    Celkem imprese
                  </td>

                  {subView === 'planning' ? (
                    WEEKS.map((w) => {
                      const weekTotal = items.reduce(
                        (sum, i) => sum + (i.weeklyAmounts[w.id] || 0),
                        0
                      )
                      return (
                        <td
                          key={w.id}
                          className="py-3 px-2 text-right text-xs font-semibold border-l border-[#EBEBED] tabular-nums"
                        >
                          {weekTotal > 0 ? formatNumber(weekTotal) : '–'}
                        </td>
                      )
                    })
                  ) : (
                    <td className="py-3 px-3 text-xs text-[#5F5F68]">
                      Souhrn za týdny
                    </td>
                  )}

                  <td className="py-3 px-3 text-right text-xs font-bold tabular-nums">
                    {formatNumber(totalImpressions)} imp.
                  </td>
                  <td className="py-3 px-2 text-right"></td>
                  <td className="py-3 px-2 text-right"></td>
                  <td className="py-3 px-3 text-center"></td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-[#18181B] tabular-nums">
                    {formatCurrency(totalClientCost)}
                  </td>
                </tr>

                {/* VAT row */}
                <tr className="bg-[#F8F8F9] text-xs text-[#5F5F68]">
                  <td
                    colSpan={subView === 'overview' ? 6 : WEEKS.length + 5}
                    className="py-2 px-4 text-right"
                  >
                    s DPH 21 %
                  </td>
                  <td className="py-2 px-4 text-right font-medium text-xs text-[#18181B] tabular-nums">
                    {formatCurrency(costWithVat)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Tab 2: Údaje části (Recreating Cast-udaje.dc.html) */}
      {mainTab === 'details' && (
        <div className="p-8 max-w-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Název <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm focus:outline-none focus:border-[#18181B]"
              />
              <span className="text-[11px] text-[#5F5F68] mt-1 block">
                Předvyplněno, můžeš přepsat.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Rozpočet části (CZK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={partBudget}
                onChange={(e) => setPartBudget(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm focus:outline-none focus:border-[#18181B]"
              />
              <span className="text-[11px] text-[#5F5F68] mt-1 block">
                Z rozpočtu kampaně zbývá rozdělit 200 000 Kč. Nejníž jde 0 Kč, nic není objednané.
              </span>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="inheritDatesCheckbox"
                checked={inheritDates}
                onChange={(e) => setInheritDates(e.target.checked)}
                className="w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-900"
              />
              <label htmlFor="inheritDatesCheckbox" className="text-xs font-medium text-[#18181B]">
                Převzít termíny kampaně
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Začátek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={partStartDate}
                  onChange={(e) => setPartStartDate(e.target.value)}
                  disabled={inheritDates}
                  className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm disabled:bg-zinc-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Konec <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={partEndDate}
                  onChange={(e) => setPartEndDate(e.target.value)}
                  disabled={inheritDates}
                  className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm disabled:bg-zinc-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Objednávka odběratele (PO)
                </label>
                <input
                  type="text"
                  value={partPo}
                  onChange={(e) => setPartPo(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm"
                />
                <span className="text-[11px] text-[#5F5F68] mt-1 block">
                  Převzato z kampaně.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Odpovědná osoba <span className="text-red-500">*</span>
                </label>
                <select
                  value={partResp}
                  onChange={(e) => setPartResp(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm"
                >
                  <option>Jana Nováková</option>
                  <option>Pavel Dvořák</option>
                  <option>Petr Svoboda</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Poznámka
              </label>
              <textarea
                rows={3}
                value={partNote}
                onChange={(e) => setPartNote(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#D4D4D8] text-sm"
              />
            </div>

            <div className="pt-4 border-t border-[#EBEBED] flex items-center justify-between">
              <span className="text-xs text-[#5F5F68]">
                Změna termínů se zapisuje s důvodem.
              </span>
              <div className="flex items-center gap-2">
                {detailsSaved && (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Uloženo
                  </span>
                )}
                <Button variant="outline" onClick={() => setMainTab('plan')}>
                  Zavřít
                </Button>
                <Button onClick={() => handleSaveDetails(false)}>
                  Uložit
                </Button>
                <Button variant="secondary" onClick={() => handleSaveDetails(true)}>
                  Uložit a otevřít mediaplán
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
