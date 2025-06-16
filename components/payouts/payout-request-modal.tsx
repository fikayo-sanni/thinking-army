"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, CreditCard, AlertCircle } from "lucide-react"

interface PayoutRequestModalProps {
  availableBalance: number
  onRequestPayout: (amount: number, method: string, address: string) => void
}

export function PayoutRequestModal({ availableBalance, onRequestPayout }: PayoutRequestModalProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onRequestPayout(Number.parseFloat(amount), method, address)
    setIsLoading(false)
    setOpen(false)

    // Reset form
    setAmount("")
    setMethod("")
    setAddress("")
  }

  const isValidAmount = Number.parseFloat(amount) > 0 && Number.parseFloat(amount) <= availableBalance

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 font-bold uppercase tracking-wide">
          <Wallet className="h-4 w-4 mr-2" />
          REQUEST PAYOUT
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1A1E2D] border-[#2C2F3C] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white uppercase tracking-wide">REQUEST PAYOUT</DialogTitle>
          <DialogDescription className="text-[#A0AFC0]">
            Withdraw your available earnings to your preferred method
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Balance Info */}
          <Card className="bg-[#0D0F1A] border-[#2C2F3C]">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00E5FF] mb-1">{availableBalance.toFixed(2)} ETH</div>
                <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">AVAILABLE BALANCE</div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
              AMOUNT (ETH)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-[#0D0F1A] border-[#2C2F3C] text-white placeholder-[#A0AFC0] focus:border-[#00E5FF]"
              required
            />
            {amount && !isValidAmount && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Amount must be between 0.01 and {availableBalance.toFixed(2)} ETH</span>
              </div>
            )}
          </div>

          {/* Withdrawal Method */}
          <div className="space-y-2">
            <Label htmlFor="method" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
              WITHDRAWAL METHOD
            </Label>
            <Select value={method} onValueChange={setMethod} required>
              <SelectTrigger className="bg-[#0D0F1A] border-[#2C2F3C] text-white">
                <SelectValue placeholder="Select withdrawal method" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
                <SelectItem value="ethereum" className="text-white hover:bg-[#2C2F3C]">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span>Ethereum Wallet</span>
                  </div>
                </SelectItem>
                <SelectItem value="bank" className="text-white hover:bg-[#2C2F3C]">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Bank Transfer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address/Account Input */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
              {method === "ethereum" ? "WALLET ADDRESS" : method === "bank" ? "ACCOUNT DETAILS" : "ADDRESS/ACCOUNT"}
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={
                method === "ethereum"
                  ? "0x..."
                  : method === "bank"
                    ? "Account number or IBAN"
                    : "Enter address or account details"
              }
              className="bg-[#0D0F1A] border-[#2C2F3C] text-white placeholder-[#A0AFC0] focus:border-[#00E5FF]"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValidAmount || !method || !address || isLoading}
            className="w-full bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 font-bold uppercase tracking-wide disabled:opacity-50"
          >
            {isLoading ? "PROCESSING..." : "CONFIRM PAYOUT REQUEST"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
