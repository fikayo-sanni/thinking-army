"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, Plus, Trash2, Copy, ExternalLink, Shield, AlertTriangle } from "lucide-react"
import { formatDate } from "@/lib/utils"

// Mock wallet data
const connectedWallets = [
  {
    id: "1",
    name: "MetaMask",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    balance: "12.45 USDC",
    status: "connected",
    isPrimary: true,
    lastUsed: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "WalletConnect",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    balance: "8.32 USDC",
    status: "connected",
    isPrimary: false,
    lastUsed: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    name: "Coinbase Wallet",
    address: "0x9876543210fedcba9876543210fedcba98765432",
    balance: "0.00 USDC",
    status: "disconnected",
    isPrimary: false,
    lastUsed: "2024-01-05T09:15:00Z",
  },
]

export default function WalletSettingsPage() {
  const [wallets, setWallets] = useState(connectedWallets)
  const [autoConnect, setAutoConnect] = useState(true)
  const [showBalances, setShowBalances] = useState(true)
  const [defaultNetwork, setDefaultNetwork] = useState("ethereum")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
    console.log("Connecting new wallet...")
  }

  const handleDisconnectWallet = (walletId: string) => {
    setWallets((prev) =>
      prev.map((wallet) => (wallet.id === walletId ? { ...wallet, status: "disconnected" } : wallet)),
    )
  }

  const handleSetPrimary = (walletId: string) => {
    setWallets((prev) =>
      prev.map((wallet) => ({
        ...wallet,
        isPrimary: wallet.id === walletId,
      })),
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification
    console.log("Copied to clipboard:", text)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">CONNECTED</Badge>
      case "disconnected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">DISCONNECTED</Badge>
      default:
        return <Badge className="bg-[#2C2F3C] text-[#A0AFC0]">{status.toUpperCase()}</Badge>
    }
  }

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="WALLET SETTINGS" description="Manage your connected wallets and blockchain settings" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wallet Overview */}
            <Card className="bg-[#1A1E2D] border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-[#0846A6]" />
                  <span>WALLET OVERVIEW</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-[#0D0F1A] border border-[#E5E7EB]">
                  <div className="text-2xl font-bold text-[#0846A6] mb-1">
                    {wallets.filter((w) => w.status === "connected").length}
                  </div>
                  <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">CONNECTED WALLETS</div>
                </div>

                <div className="text-center p-4 rounded-lg bg-[#0D0F1A] border border-[#E5E7EB]">
                  <div className="text-2xl font-bold text-[#00B28C] mb-1">
                    {wallets
                      .filter((w) => w.status === "connected")
                      .reduce((sum, w) => sum + Number.parseFloat(w.balance.split(" ")[0]), 0)
                      .toFixed(2)}{" "}
                    ETH
                  </div>
                  <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">TOTAL BALANCE</div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm uppercase tracking-wider">PRIMARY WALLET</h4>
                  {wallets.find((w) => w.isPrimary) && (
                    <div className="p-3 rounded-lg bg-[#0846A6]/10 border border-[#0846A6]/30">
                      <div className="flex items-center space-x-2 mb-1">
                        <Wallet className="h-4 w-4 text-[#0846A6]" />
                        <span className="text-white font-medium text-sm">{wallets.find((w) => w.isPrimary)?.name}</span>
                      </div>
                      <div className="text-[#A0AFC0] text-xs font-mono">
                        {wallets.find((w) => w.isPrimary)?.address.slice(0, 10)}...
                        {wallets.find((w) => w.isPrimary)?.address.slice(-8)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Connected Wallets */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#1A1E2D] border-[#E5E7EB]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                      <Wallet className="h-5 w-5 text-[#0846A6]" />
                      <span>CONNECTED WALLETS</span>
                    </CardTitle>
                    <Button
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                      className="bg-[#0846A6] text-black hover:bg-[#0846A6]/90 font-bold uppercase tracking-wide"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        wallet.isPrimary
                          ? "bg-[#0846A6]/5 border-[#0846A6]/30"
                          : "bg-[#0D0F1A] border-[#E5E7EB] hover:border-[#0846A6]/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0846A6] to-[#6F00FF] flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-white font-medium">{wallet.name}</h3>
                              {wallet.isPrimary && (
                                <Badge className="bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30 text-xs">
                                  PRIMARY
                                </Badge>
                              )}
                            </div>
                            <p className="text-[#A0AFC0] text-sm">
                              Last used: {formatDate(wallet.lastUsed)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">{getStatusBadge(wallet.status)}</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 rounded bg-[#2C2F3C]/30">
                          <span className="text-[#A0AFC0] text-sm">Address:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-mono text-sm">
                              {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(wallet.address)}
                              className="h-6 w-6 p-0 text-[#A0AFC0] hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[#A0AFC0] hover:text-white">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded bg-[#2C2F3C]/30">
                          <span className="text-[#A0AFC0] text-sm">Balance:</span>
                          <span className="text-[#0846A6] font-bold">{wallet.balance}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            {!wallet.isPrimary && wallet.status === "connected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetPrimary(wallet.id)}
                                className="border-[#0846A6] text-[#0846A6] hover:bg-[#0846A6]/10"
                              >
                                Set as Primary
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {wallet.status === "connected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisconnectWallet(wallet.id)}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Disconnect
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Wallet Preferences */}
              <Card className="bg-[#1A1E2D] border-[#E5E7EB]">
                <CardHeader>
                  <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-[#0846A6]" />
                    <span>WALLET PREFERENCES</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Auto-Connect</h4>
                      <p className="text-[#A0AFC0] text-sm">Automatically connect to your primary wallet on login</p>
                    </div>
                    <Switch checked={autoConnect} onCheckedChange={setAutoConnect} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Show Balances</h4>
                      <p className="text-[#A0AFC0] text-sm">Display wallet balances in the interface</p>
                    </div>
                    <Switch checked={showBalances} onCheckedChange={setShowBalances} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#A0AFC0] uppercase text-xs tracking-wider">DEFAULT NETWORK</Label>
                    <Select value={defaultNetwork} onValueChange={setDefaultNetwork}>
                      <SelectTrigger className="bg-[#0D0F1A] border-[#E5E7EB] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1E2D] border-[#E5E7EB]">
                        <SelectItem value="ethereum" className="text-white hover:bg-[#2C2F3C]">
                          Ethereum Mainnet
                        </SelectItem>
                        <SelectItem value="polygon" className="text-white hover:bg-[#2C2F3C]">
                          Polygon
                        </SelectItem>
                        <SelectItem value="bsc" className="text-white hover:bg-[#2C2F3C]">
                          Binance Smart Chain
                        </SelectItem>
                        <SelectItem value="arbitrum" className="text-white hover:bg-[#2C2F3C]">
                          Arbitrum
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-[#1A1E2D] border-[#E5E7EB]">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Security Notice</h4>
                      <p className="text-[#A0AFC0] text-sm leading-relaxed">
                        Never share your private keys or seed phrases. Gamescoin will never ask for your wallet
                        credentials. Always verify transaction details before confirming.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ModernSidebar>
  )
}
