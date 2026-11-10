export interface Campaign {
  id: string
  name: string
  client: string
  goal: string
  startDate: string
  endDate: string
  totalBudget: number
  currency: string
  poNumber: string
  responsiblePerson: string
  brand?: string
  productLine?: string
  vatRate?: string
  budgetIncludes?: string[]
  tags?: string[]
  note?: string
  status: 'active' | 'closed' | 'concept'
  parts: MediaPart[]
}

export interface MediaPart {
  id: string
  campaignId: string
  name: string
  budget: number
  startDate: string
  endDate: string
  inheritDates: boolean
  poNumber: string
  responsiblePerson: string
  note?: string
  status: 'Rezervace' | 'Koncept' | 'Objednáno' | 'Stornovaná'
  confirmedCount?: number
  totalCount?: number
  items: PlanItem[]
}

export type ItemCategory = 'Awareness' | 'Výkon' | 'Ostatní'

export type ItemStatus = 'Rezervováno' | 'Rezervace odeslána' | 'Koncept' | 'Schváleno' | 'Objednáno'

export interface PlanItem {
  id: string
  category: ItemCategory
  name: string
  subtext: string
  format: 'imp' | 'ks' | 'fix'
  totalAmount: number
  discountPct: number
  commissionPct: number
  clientCost: number
  status: ItemStatus
  weeklyAmounts: Record<string, number> // week id -> amount
}

export interface WeekColumn {
  id: string
  label: string
  dateRange: string
}
