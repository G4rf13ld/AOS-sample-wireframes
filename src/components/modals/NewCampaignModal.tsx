import React, { useState } from 'react'
import { Campaign } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface NewCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (campaign: Campaign, andCreatePart: boolean) => void
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('Letní promo 2027')
  const [client, setClient] = useState('Nordia Foods')
  const [goal, setGoal] = useState('Maximální efektivní zásah')
  const [startDate, setStartDate] = useState('1. 6. 2027')
  const [endDate, setEndDate] = useState('31. 8. 2027')
  const [budget, setBudget] = useState('800 000')
  const [currency, setCurrency] = useState('CZK')
  const [responsiblePerson, setResponsiblePerson] = useState('Jana Nováková')

  // Additional fields
  const [showAdditional, setShowAdditional] = useState(false)
  const [brand, setBrand] = useState('Nordia')
  const [product, setProduct] = useState('')
  const [poNumber, setPoNumber] = useState('')
  const [note, setNote] = useState('')

  const handleSave = (andCreatePart: boolean) => {
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name,
      client,
      goal,
      startDate,
      endDate,
      totalBudget: Number(budget.replace(/\s/g, '')) || 500000,
      currency,
      poNumber,
      responsiblePerson,
      brand,
      productLine: product,
      note,
      status: 'active',
      parts: [],
    }
    onSave(newCamp, andCreatePart)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-8">
        {/* Stepper matching wireframe 1 */}
        <div className="flex items-center gap-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#18181B] text-white flex items-center justify-center text-xs font-semibold">
              1
            </div>
            <span className="text-xs font-semibold text-[#18181B]">Kampaň</span>
          </div>

          <div className="flex-1 h-px bg-zinc-300" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-zinc-300 text-zinc-500 flex items-center justify-center text-xs font-semibold">
              2
            </div>
            <span className="text-xs text-[#5F5F68]">
              Mediální část a mediaplán · kdykoli později
            </span>
          </div>
        </div>

        <DialogHeader className="pt-2 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight text-[#18181B]">
            Nová kampaň
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-[#18181B] mb-1.5">
              Název kampaně <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Odběratel <span className="text-red-500">*</span>
              </label>
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-white text-sm"
              >
                <option>Nordia Foods</option>
                <option>Vela Drinks</option>
                <option>Apex Retail</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Cíl kampaně <span className="text-red-500">*</span>
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-white text-sm"
              >
                <option>Maximální efektivní zásah</option>
                <option>Akvizice / Konverze</option>
                <option>Podpora povědomí značky</option>
              </select>
            </div>
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
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm"
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
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Rozpočet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Měna <span className="text-red-500">*</span>
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#D4D4D8] bg-white text-sm"
              >
                <option>CZK</option>
                <option>EUR</option>
              </select>
            </div>
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
            <span className="text-[11px] text-[#5F5F68] mt-1 block">
              Předvyplněno podle toho, kdo kampaň zakládá.
            </span>
          </div>

          {/* Collapsible Další údaje */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdditional(!showAdditional)}
              className="flex items-center gap-1.5 text-xs text-[#5F5F68] hover:text-[#18181B] font-medium py-1"
            >
              <span>Další údaje (značka, produkt, PO, poznámka)</span>
              {showAdditional ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showAdditional && (
              <div className="space-y-3 pt-2 pl-1 border-l-2 border-zinc-200 mt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5F5F68] mb-1">
                      Značka
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-md border border-[#D4D4D8] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5F5F68] mb-1">
                      Produkt
                    </label>
                    <input
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-md border border-[#D4D4D8] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#5F5F68] mb-1">
                    PO objednávka
                  </label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-md border border-[#D4D4D8] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#5F5F68] mb-1">
                    Poznámka
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 rounded-md border border-[#D4D4D8] text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
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
                Uložit a založit mediální část
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-[#5F5F68] text-right">
            Mediální část můžeš založit hned, později, nebo ji založí kolega. Kampaň na ni počká v přehledu.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
