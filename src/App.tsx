import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { INITIAL_CAMPAIGNS } from './data/mockData'
import { Campaign, MediaPart } from './types'
import { SidebarNav } from './components/layout/SidebarNav'
import { Header } from './components/layout/Header'
import { CampaignsListView } from './components/views/CampaignsListView'
import { CampaignDetailView } from './components/views/CampaignDetailView'
import { MediaPlanView } from './components/views/MediaPlanView'
import { MillerColumnsView } from './components/views/MillerColumnsView'
import { NewCampaignModal } from './components/modals/NewCampaignModal'
import { NewMediaPartModal } from './components/modals/NewMediaPartModal'

export function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [selectedPart, setSelectedPart] = useState<MediaPart | null>(null)

  // Navigation view: 'campaigns' | 'campaign-detail' | 'plan'
  const [currentView, setCurrentView] = useState<'campaigns' | 'campaign-detail' | 'plan'>('campaigns')
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward')

  // View mode: 'collapsed-path' (sloupce sbalené do cesty) vs 'miller-columns' (3 sloupce vedle sebe)
  const [viewMode, setViewMode] = useState<'collapsed-path' | 'miller-columns'>('collapsed-path')

  // Sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeModule, setActiveModule] = useState('kampane')

  // Modals
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false)
  const [isNewPartOpen, setIsNewPartOpen] = useState(false)
  const [targetCampaignForPart, setTargetCampaignForPart] = useState<Campaign | null>(null)

  // Handlers for navigation
  const handleSelectCampaignsList = () => {
    setSlideDirection('backward')
    setCurrentView('campaigns')
    setSelectedCampaign(null)
    setSelectedPart(null)
    // In campaigns list, sidebar can be open
    setIsSidebarCollapsed(false)
  }

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)

    // Check single-part logic:
    // "Kampaň s jedinou částí úroveň části přeskočí a otevře rovnou plán, což už ve flows máme.
    //  Článek části se v cestě ukáže, až budou části aspoň dvě."
    if (campaign.parts.length === 1) {
      setSelectedPart(campaign.parts[0])
      setSlideDirection('forward')
      setCurrentView('plan')
      // Auto-collapse sidebar in plan mode
      setIsSidebarCollapsed(true)
    } else {
      setSelectedPart(null)
      setSlideDirection('forward')
      setCurrentView('campaign-detail')
      setIsSidebarCollapsed(false)
    }
  }

  const handleSelectPart = (part: MediaPart) => {
    setSelectedPart(part)
    setSlideDirection('forward')
    setCurrentView('plan')
    // In plan view, module menu collapses to icons strip
    // "Tvoje levé menu modulů se do toho vejde jako úzký pruh, který je v plánu sbalený na ikony."
    setIsSidebarCollapsed(true)
  }

  const handleBack = () => {
    setSlideDirection('backward')
    if (currentView === 'plan') {
      // If the campaign has multiple parts, go back to campaign detail.
      // If single-part campaign, go back to campaigns list.
      if ((selectedCampaign?.parts.length ?? 0) >= 2) {
        setCurrentView('campaign-detail')
        setSelectedPart(null)
        setIsSidebarCollapsed(false)
      } else {
        setCurrentView('campaigns')
        setSelectedCampaign(null)
        setSelectedPart(null)
        setIsSidebarCollapsed(false)
      }
    } else if (currentView === 'campaign-detail') {
      setCurrentView('campaigns')
      setSelectedCampaign(null)
      setSelectedPart(null)
      setIsSidebarCollapsed(false)
    }
  }

  // Save new campaign
  const handleSaveCampaign = (newCamp: Campaign, andCreatePart: boolean) => {
    setCampaigns((prev) => [newCamp, ...prev])
    setSelectedCampaign(newCamp)

    if (andCreatePart) {
      setTargetCampaignForPart(newCamp)
      setIsNewPartOpen(true)
    } else {
      // Open campaign detail
      setCurrentView('campaign-detail')
    }
  }

  // Save new media part
  const handleSaveMediaPart = (newPart: MediaPart, andOpenPlan: boolean) => {
    const parentCamp = targetCampaignForPart || selectedCampaign
    if (!parentCamp) return

    const updatedCamp: Campaign = {
      ...parentCamp,
      parts: [...parentCamp.parts, newPart],
    }

    setCampaigns((prev) =>
      prev.map((c) => (c.id === updatedCamp.id ? updatedCamp : c))
    )
    setSelectedCampaign(updatedCamp)

    if (andOpenPlan) {
      setSelectedPart(newPart)
      setCurrentView('plan')
      setIsSidebarCollapsed(true)
    } else {
      setCurrentView('campaign-detail')
    }
  }

  // Update existing campaign
  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setSelectedCampaign(updated)
  }

  // Update existing media part
  const handleUpdatePart = (updatedPart: MediaPart) => {
    if (!selectedCampaign) return

    const updatedParts = selectedCampaign.parts.map((p) =>
      p.id === updatedPart.id ? updatedPart : p
    )
    const updatedCamp = { ...selectedCampaign, parts: updatedParts }

    setSelectedPart(updatedPart)
    setSelectedCampaign(updatedCamp)
    setCampaigns((prev) => prev.map((c) => (c.id === updatedCamp.id ? updatedCamp : c)))
  }

  // Slide variants for columns sliding over each other
  const slideVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '100%' : '-30%',
      opacity: 0,
      boxShadow: '-10px 0 25px rgba(0,0,0,0.1)',
    }),
    center: {
      x: 0,
      opacity: 1,
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '-30%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.15 },
      },
    }),
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#18181B] font-sans antialiased">
      {/* Left Module Navigation */}
      <SidebarNav
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod)
          if (mod === 'kampane') {
            handleSelectCampaignsList()
          }
        }}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header with Breadcrumbs ("sloupce sbalené do cesty") */}
        <Header
          campaigns={campaigns}
          selectedCampaign={selectedCampaign}
          selectedPart={selectedPart}
          currentView={currentView}
          onSelectCampaignsList={handleSelectCampaignsList}
          onSelectCampaign={handleSelectCampaign}
          onSelectPart={handleSelectPart}
          onOpenNewCampaign={() => setIsNewCampaignOpen(true)}
          onOpenNewPart={() => {
            setTargetCampaignForPart(selectedCampaign)
            setIsNewPartOpen(true)
          }}
          onBack={handleBack}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {/* View Mode 1: Sloupce sbalené do cesty (Sliding Column Views) */}
        {viewMode === 'collapsed-path' ? (
          <div className="flex-1 relative overflow-hidden bg-white">
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              {currentView === 'campaigns' && (
                <motion.div
                  key="campaigns-list"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col bg-white overflow-hidden"
                >
                  <CampaignsListView
                    campaigns={campaigns}
                    onSelectCampaign={handleSelectCampaign}
                    onOpenNewCampaign={() => setIsNewCampaignOpen(true)}
                  />
                </motion.div>
              )}

              {currentView === 'campaign-detail' && selectedCampaign && (
                <motion.div
                  key={`campaign-${selectedCampaign.id}`}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col bg-white overflow-hidden"
                >
                  <CampaignDetailView
                    campaign={selectedCampaign}
                    onSelectPart={handleSelectPart}
                    onOpenNewPart={() => {
                      setTargetCampaignForPart(selectedCampaign)
                      setIsNewPartOpen(true)
                    }}
                    onUpdateCampaign={handleUpdateCampaign}
                  />
                </motion.div>
              )}

              {currentView === 'plan' && selectedCampaign && selectedPart && (
                <motion.div
                  key={`plan-${selectedPart.id}`}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col bg-white overflow-hidden"
                >
                  <MediaPlanView
                    campaign={selectedCampaign}
                    part={selectedPart}
                    onUpdatePart={handleUpdatePart}
                    onOpenEditModal={() => {
                      setTargetCampaignForPart(selectedCampaign)
                      setIsNewPartOpen(true)
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* View Mode 2: 3 Sloupce vedle sebe (Přístup 3 z wireframe) */
          <MillerColumnsView
            campaigns={campaigns}
            selectedCampaign={selectedCampaign}
            selectedPart={selectedPart}
            onSelectCampaign={(c) => {
              setSelectedCampaign(c)
              setSelectedPart(c.parts[0] || null)
            }}
            onSelectPart={setSelectedPart}
            onOpenNewCampaign={() => setIsNewCampaignOpen(true)}
            onOpenNewPart={() => {
              setTargetCampaignForPart(selectedCampaign || campaigns[0])
              setIsNewPartOpen(true)
            }}
          />
        )}
      </div>

      {/* New Campaign Modal */}
      <NewCampaignModal
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
        onSave={handleSaveCampaign}
      />

      {/* New Media Part Modal */}
      {isNewPartOpen && (targetCampaignForPart || selectedCampaign) && (
        <NewMediaPartModal
          isOpen={isNewPartOpen}
          campaign={(targetCampaignForPart || selectedCampaign)!}
          onClose={() => {
            setIsNewPartOpen(false)
            setTargetCampaignForPart(null)
          }}
          onSave={handleSaveMediaPart}
        />
      )}
    </div>
  )
}

export default App
