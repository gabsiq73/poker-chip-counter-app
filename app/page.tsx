"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Minus, Plus, X, Zap } from "lucide-react"

interface GameAction {
  type: "bet" | "win" | "fold" | "allin"
  amount: number
  timestamp: Date
}

const chipValues = [1, 5, 25, 100, 500, 1000]

const getChipColor = (total: number) => {
  if (total >= 1000) return { bg: "bg-yellow-400", border: "border-yellow-600", text: "text-yellow-900" }
  if (total >= 500) return { bg: "bg-purple-500", border: "border-purple-700", text: "text-white" }
  if (total >= 100) return { bg: "bg-gray-800", border: "border-gray-900", text: "text-white" }
  if (total >= 25) return { bg: "bg-green-600", border: "border-green-800", text: "text-white" }
  if (total >= 5) return { bg: "bg-red-500", border: "border-red-700", text: "text-white" }
  return { bg: "bg-white", border: "border-gray-300", text: "text-gray-900" }
}

const getChipGradient = (total: number) => {
  if (total >= 1000) return "#fbbf24, #f59e0b, #d97706" // Yellow gradient
  if (total >= 500) return "#8b5cf6, #7c3aed, #6d28d9" // Purple gradient
  if (total >= 100) return "#374151, #1f2937, #111827" // Black gradient
  if (total >= 25) return "#059669, #047857, #065f46" // Green gradient
  if (total >= 5) return "#dc2626, #b91c1c, #991b1b" // Red gradient
  return "#f9fafb, #f3f4f6, #e5e7eb" // White gradient
}

export default function PokerChipCounter() {
  const [totalChips, setTotalChips] = useState<number>(0)
  const [pot, setPot] = useState<number>(0) // Added pot state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"bet" | "win">("bet")
  const [history, setHistory] = useState<GameAction[]>([])
  const [isInitialSetup, setIsInitialSetup] = useState(true)
  const [initialChips, setInitialChips] = useState("")
  const [chipAnimation, setChipAnimation] = useState("")
  const [potAnimation, setPotAnimation] = useState("") // Added pot animation state

  const chipColor = getChipColor(totalChips)
  const potColor = getChipColor(pot) // Added pot color

  const handleInitialSetup = () => {
    const chips = Number.parseInt(initialChips) || 100
    setTotalChips(chips)
    setIsInitialSetup(false)
  }

  const handleChipAction = (amount: number) => {
    const newAction: GameAction = {
      type: modalType,
      amount,
      timestamp: new Date(),
    }

    if (modalType === "bet") {
      const betAmount = Math.min(amount, totalChips)
      setTotalChips((prev) => prev - betAmount)
      setPot((prev) => prev + betAmount) // Add bet to pot
      setChipAnimation("chip-shake")
      setPotAnimation("chip-glow") // Animate pot when betting
      newAction.amount = betAmount
    } else {
      const potReturn = pot
      const bonusAmount = amount
      setTotalChips((prev) => prev + potReturn + bonusAmount)
      setPot(0) // Clear pot when winning
      setChipAnimation("chip-glow")
      newAction.amount = potReturn + bonusAmount
    }

    setHistory((prev) => [newAction, ...prev.slice(0, 4)])
    setIsModalOpen(false)

    // Remove animations after they complete
    setTimeout(() => {
      setChipAnimation("")
      setPotAnimation("")
    }, 800)
  }

  const handleFold = () => {
    const newAction: GameAction = {
      type: "fold",
      amount: pot,
      timestamp: new Date(),
    }

    setPot(0) // Clear pot
    setHistory((prev) => [newAction, ...prev.slice(0, 4)])
    setPotAnimation("chip-shake")

    setTimeout(() => setPotAnimation(""), 800)
  }

  const handleAllIn = () => {
    if (totalChips === 0) return

    const newAction: GameAction = {
      type: "allin",
      amount: totalChips,
      timestamp: new Date(),
    }

    setPot((prev) => prev + totalChips)
    setTotalChips(0)
    setHistory((prev) => [newAction, ...prev.slice(0, 4)])
    setChipAnimation("chip-shake")
    setPotAnimation("chip-glow")

    setTimeout(() => {
      setChipAnimation("")
      setPotAnimation("")
    }, 800)
  }

  const openModal = (type: "bet" | "win") => {
    setModalType(type)
    setIsModalOpen(true)
  }

  if (isInitialSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Contador de Fichas</h1>
              <p className="text-gray-600">Defina suas fichas iniciais</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initial-chips">Fichas Iniciais</Label>
                <Input
                  id="initial-chips"
                  type="number"
                  placeholder="100"
                  value={initialChips}
                  onChange={(e) => setInitialChips(e.target.value)}
                  className="text-center text-lg"
                />
              </div>

              <Button
                onClick={handleInitialSetup}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Começar Jogo
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 p-4">
      <div className="max-w-md mx-auto space-y-8 pt-8">
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg p-3 shadow-xl border-2 border-amber-300 min-w-[120px]">
            {/* Pot label */}
            <div className="text-center mb-2">
              <div className="text-amber-800 text-sm font-bold tracking-wider">POTE</div>
            </div>

            {/* Large pot value */}
            <div className="text-center mb-3">
              <div className="text-3xl font-black text-amber-900">{pot}</div>
            </div>

            {/* Visual chips inside the pot */}
            <div className="flex justify-center items-end space-x-1 h-8">
              {pot > 0 && (
                <>
                  <div className="w-4 h-6 bg-red-500 rounded-full border border-red-700 shadow-sm"></div>
                  <div className="w-4 h-5 bg-green-600 rounded-full border border-green-800 shadow-sm"></div>
                  <div className="w-4 h-7 bg-blue-500 rounded-full border border-blue-700 shadow-sm"></div>
                  {pot >= 100 && (
                    <div className="w-4 h-4 bg-purple-500 rounded-full border border-purple-700 shadow-sm"></div>
                  )}
                  {pot >= 500 && (
                    <div className="w-4 h-6 bg-yellow-400 rounded-full border border-yellow-600 shadow-sm"></div>
                  )}
                </>
              )}
              {pot === 0 && <div className="text-amber-600 text-xs italic">Vazio</div>}
            </div>

            {/* Pot animation overlay */}
            <div className={`absolute inset-0 rounded-lg ${potAnimation} pointer-events-none`}></div>
          </div>
        </div>

        {/* Main Chip Display */}
        <div className="flex justify-center">
          <div
            className={`
              relative w-64 h-64 rounded-full flex items-center justify-center
              shadow-2xl transform transition-all duration-300
              ${chipColor.bg} ${chipAnimation}
            `}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${getChipGradient(totalChips)})`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.2)",
            }}
          >
            {/* Outer dashed border ring */}
            <div className="absolute inset-2 rounded-full border-4 border-dashed border-white/80"></div>

            {/* Inner decorative dots pattern */}
            <div className="absolute inset-6 rounded-full">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-white/60 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-85px)`,
                  }}
                />
              ))}
            </div>

            {/* Center content */}
            <div className="relative z-10 text-center">
              <div className={`text-5xl font-black ${chipColor.text} drop-shadow-lg`}>{totalChips}</div>
              <div className={`text-sm font-semibold ${chipColor.text} opacity-90 tracking-wider`}>FICHAS</div>
            </div>

            {/* Inner highlight ring */}
            <div className="absolute inset-8 rounded-full border-2 border-white/30"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => openModal("bet")}
            className="h-16 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold"
            disabled={totalChips === 0}
          >
            <Minus className="w-5 h-5 mr-2" />
            Apostar
          </Button>

          <Button
            onClick={() => openModal("win")}
            className="h-16 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ganhar
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleFold}
            className="h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold shadow-lg"
            disabled={pot === 0}
          >
            <X className="w-4 h-4 mr-2" />
            Fold
          </Button>

          <Button
            onClick={handleAllIn}
            className="h-12 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold shadow-lg"
            disabled={totalChips === 0}
          >
            <Zap className="w-4 h-4 mr-2" />
            All In
          </Button>
        </div>

        {history.length > 0 && (
          <Card className="p-4 bg-white/95 backdrop-blur">
            <h3 className="font-semibold mb-3 text-gray-900">Últimas Jogadas</h3>
            <div className="space-y-2">
              {history.map((action, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span
                    className={
                      action.type === "win"
                        ? "text-green-600"
                        : action.type === "fold"
                          ? "text-gray-600"
                          : action.type === "allin"
                            ? "text-yellow-600"
                            : "text-red-600"
                    }
                  >
                    {action.type === "win" && `+${action.amount} fichas (ganhou)`}
                    {action.type === "bet" && `-${action.amount} fichas (apostou)`}
                    {action.type === "fold" && `Fold (perdeu ${action.amount})`}
                    {action.type === "allin" && `All In (${action.amount} fichas)`}
                  </span>
                  <span className="text-gray-500">
                    {action.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Reset Button */}
        <Button
          onClick={() => {
            setIsInitialSetup(true)
            setPot(0) // Reset pot on game restart
          }}
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Reiniciar Jogo
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              {modalType === "bet"
                ? "Quanto apostar?"
                : pot > 0
                  ? `Pote: ${pot} fichas. Quantas fichas bônus ganhou?`
                  : "Quanto ganhou?"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 p-4">
            {chipValues.map((value) => {
              const canBet = modalType === "win" || totalChips >= value
              const chipStyle = getChipColor(value)

              return (
                <Button
                  key={value}
                  onClick={() => handleChipAction(value)}
                  disabled={!canBet}
                  className={`
                    h-16 rounded-full border-4 font-bold text-lg
                    ${chipStyle.bg} ${chipStyle.border} ${chipStyle.text}
                    hover:scale-105 transition-transform
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  variant="outline"
                >
                  {value}
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
