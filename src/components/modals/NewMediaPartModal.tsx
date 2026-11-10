import React, { useState } from 'react'
import { Campaign, MediaPart } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface NewMediaPartModalProps {
  isOpen: boolean
  campaign: Campaign
  onClose: () => void
  onSave: (newPart: MediaPart, andOpenPlan: boolean) => void
}

export const NewMediaPartModal: React.FC<NewMediaPartModalProps> = ({
  isOpen,
  campaign,
  onClose,
  onSave,
}) => {
  const nextPartIndex = (campaign?.parts.length || 0) + 1
  const [name, setName] = useState(`Online ${nextPartIndex}`)

  // Calculate unallocated budget
  const allocated = campaign?.parts.reduce((sum, p) => sum + p.budget, 0) || 0
  const remainingInCampaign = Math.max(0, (campaign?.totalBudget || 0) - allocated)

  const [budget, setBudget] = useState(
    remainingInCampaign > 0 ? (remainingInCampaign / 2).toString() : '200000'
  )
  const [inheritDates, setInheritDates] = useState(true)
  const [startDate, setStartDate] = useState(campaign?.startDate || '1. 3. 2027')
  const [endDate, setEndDate] = useState(campaign?.endDate || '30. 4. 2027')
  const [poNumber, setPoNumber] = useState(campaign?.poNumber || '')
  const [responsiblePerson, setResponsiblePerson] = useState(
    campaign?.responsiblePerson || 'Jana Nováková'
  )
  const [note, setNote] = useState('')

  const handleSave = (andOpenPlan: boolean) => {
    const part: MediaPart = {
      id: `part-${Date.now()}`,
      campaignId: campaign.id,
      name,
      budget: Number(budget.replace(/\s/g, '')) || 200000,
      inheritDates,
      startDate,
      endDate,
      poNumber,
      responsiblePerson,
      note,
      status: 'Koncept',
      confirmedCount: 0,
      totalCount: 0,
      items: [],
    }
    onSave(part, andOpenPlan)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-8">
        {/* Stepper matching wireframe 2 */}
        <div className="flex items-center gap-3 pb-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <div className="w-6 h-6 rounded-full border border-zinc-300 flex items-center justify-center text-xs font-semibold">
              <Check className="w-3.5 h-3.5 text-zinc-700" />
            </div>
            <span className="text-xs text-[#5F5F68]">Kampaň · uložená</span>
          </div>

          <div className="flex-1 h-px bg-zinc-300" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#18181B] text-white flex items-center justify-center text-xs font-semibold">
              2
            </div>
            <span className="text-xs font-semibold text-[#18181B]">
              Mediální část a mediaplán
            </span>
          </div>
        </div>

        <DialogHeader className="pt-2 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight text-[#18181B]">
            Nová mediální část
          </DialogTitle>
          <p className="text-xs text-[#5F5F68] mt-1">
            {campaign?.name} · {campaign?.client} · {campaign?.startDate} – {campaign?.endDate}
          </p>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-[#18181B] mb-1.5">
              Název <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm focus:outline-none focus:border-[#18181B]"
            />
            <span className="text-[11px] text-[#5F5F68] mt-1 block">
              Z rozpočtu kampaně zbývá rozdělit {formatCurrency(remainingInCampaign)}.
            </span>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="partInheritDatesCheckbox"
              checked={inheritDates}
              onChange={(e) => setInheritDates(e.target.checked)}
              className="w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-900"
            />
            <label htmlFor="partInheritDatesCheckbox" className="text-xs font-medium text-[#18181B]">
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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
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
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-white text-sm"
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
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#D4D4D8] text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#EBEBED] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onClose}>
              Zavřít
            </Button>
            <div className="flex items-center gap-2">
              <Button onClick={() => handleSave(false)}>
                Uložit
              </Button>
              <Button variant="secondary" onClick={() => handleSave(true)}>
                Uložit a otevřít mediaplán
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-[#5F5F68] text-right">
            Po uložení se otevře mediaplán s ceníkem. Když teď zavřeš, kampaň zůstane uložená a pokračovat může kdokoli z týmu.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
