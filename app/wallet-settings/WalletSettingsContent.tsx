'use client';

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Plus, Trash2, Copy, ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { formatThousands } from "@/lib/utils";

// Safe format date function
function formatDate(date: string | undefined): string {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

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
];

export function WalletSettingsContent() {
  const [wallets, setWallets] = useState(connectedWallets);
  const [autoConnect, setAutoConnect] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [defaultNetwork, setDefaultNetwork] = useState("ethereum");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConnecting(false);
    console.log("Connecting new wallet...");
  };

  const handleDisconnectWallet = (walletId: string) => {
    setWallets((prev) =>
      prev.map((wallet) => (wallet.id === walletId ? { ...wallet, status: "disconnected" } : wallet)),
    );
  };

  const handleSetPrimary = (walletId: string) => {
    setWallets((prev) =>
      prev.map((wallet) => ({
        ...wallet,
        isPrimary: wallet.id === walletId,
      })),
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
    console.log("Copied to clipboard:", text);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="success">CONNECTED</Badge>;
      case "disconnected":
        return <Badge variant="destructive">DISCONNECTED</Badge>;
      default:
        return <Badge variant="secondary">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title Block */}
      <PageHeader title="WALLET SETTINGS" description="Manage your connected wallets and blockchain settings" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span>WALLET OVERVIEW</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-primary mb-1">
                {wallets.filter((w) => w.status === "connected").length}
              </div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">CONNECTED WALLETS</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-success mb-1">
                {wallets
                  .filter((w) => w.status === "connected")
                  .reduce((sum, w) => sum + Number.parseFloat(w.balance.split(" ")[0]), 0)
                  .toFixed(2)}{" "}
                ETH
              </div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">TOTAL BALANCE</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm uppercase tracking-wider">PRIMARY WALLET</h4>
              {wallets.find((w) => w.isPrimary) && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{wallets.find((w) => w.isPrimary)?.name}</span>
                  </div>
                  <div className="text-muted-foreground text-xs font-mono">
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span>CONNECTED WALLETS</span>
                </CardTitle>
                <Button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  variant="default"
                  className="font-bold uppercase tracking-wide"
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
                      ? "bg-primary/5 border-primary/30"
                      : "bg-muted border-border hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{wallet.name}</h3>
                          {wallet.isPrimary && (
                            <Badge variant="outline" className="text-xs">
                              PRIMARY
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Last used: {formatDate(wallet.lastUsed)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">{getStatusBadge(wallet.status)}</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded bg-muted">
                      <span className="text-muted-foreground text-sm">Address:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">
                          {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(wallet.address)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-muted">
                      <span className="text-muted-foreground text-sm">Balance:</span>
                      <span className="text-primary font-bold">{wallet.balance}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        {!wallet.isPrimary && wallet.status === "connected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetPrimary(wallet.id)}
                            className="text-primary hover:bg-primary/10"
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
                            className="text-destructive hover:bg-destructive/10"
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>WALLET PREFERENCES</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-Connect</h4>
                  <p className="text-muted-foreground text-sm">Automatically connect to your primary wallet on login</p>
                </div>
                <Switch checked={autoConnect} onCheckedChange={setAutoConnect} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Balances</h4>
                  <p className="text-muted-foreground text-sm">Display wallet balances in the interface</p>
                </div>
                <Switch checked={showBalances} onCheckedChange={setShowBalances} />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground uppercase text-xs tracking-wider">DEFAULT NETWORK</Label>
                <Select value={defaultNetwork} onValueChange={setDefaultNetwork}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Security Notice</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
  );
} 