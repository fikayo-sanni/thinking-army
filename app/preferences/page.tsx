"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/components/theme/theme-provider"
import { Settings, Palette, Bell, Globe, Moon, Sun, Monitor, Save } from "lucide-react"

export default function PreferencesPage() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [commissionAlerts, setCommissionAlerts] = useState(true)
  const [rankUpdates, setRankUpdates] = useState(true)
  const [payoutNotifications, setPayoutNotifications] = useState(true)

  // Display preferences
  const [language, setLanguage] = useState("en")
  const [currency, setCurrency] = useState("USD")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [timeFormat, setTimeFormat] = useState("12")

  // Interface preferences
  const [soundEffects, setSoundEffects] = useState(true)
  const [animations, setAnimations] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState([30])

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log("Preferences saved")
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Page Title Block */}
        <PageHeader title="PREFERENCES" description="Customize your experience and application settings" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme & Appearance */}
          <Card className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <Palette className="h-5 w-5 text-[#00E5FF]" />
                <span>THEME & APPEARANCE</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-[#A0AFC0] uppercase text-xs tracking-wider mb-3 block">COLOR THEME</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className={`h-12 justify-start space-x-3 ${theme === "light"
                          ? "bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
                          : "border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF]"
                        }`}
                    >
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className={`h-12 justify-start space-x-3 ${theme === "dark"
                          ? "bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
                          : "border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF]"
                        }`}
                    >
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Compact Mode</h4>
                    <p className="text-[#A0AFC0] text-sm">Reduce spacing and padding for more content</p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Animations</h4>
                    <p className="text-[#A0AFC0] text-sm">Enable smooth transitions and animations</p>
                  </div>
                  <Switch checked={animations} onCheckedChange={setAnimations} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Sound Effects</h4>
                    <p className="text-[#A0AFC0] text-sm">Play sounds for notifications and actions</p>
                  </div>
                  <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <Bell className="h-5 w-5 text-[#00E5FF]" />
                <span>NOTIFICATIONS</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-[#A0AFC0] text-sm">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Push Notifications</h4>
                    <p className="text-[#A0AFC0] text-sm">Browser and mobile push notifications</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Commission Alerts</h4>
                    <p className="text-[#A0AFC0] text-sm">Notify when you earn new commissions</p>
                  </div>
                  <Switch checked={commissionAlerts} onCheckedChange={setCommissionAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Rank Updates</h4>
                    <p className="text-[#A0AFC0] text-sm">Notify about rank progression</p>
                  </div>
                  <Switch checked={rankUpdates} onCheckedChange={setRankUpdates} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Payout Notifications</h4>
                    <p className="text-[#A0AFC0] text-sm">Notify about payout status changes</p>
                  </div>
                  <Switch checked={payoutNotifications} onCheckedChange={setPayoutNotifications} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <Globe className="h-5 w-5 text-[#00E5FF]" />
                <span>LANGUAGE & REGION</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#A0AFC0] uppercase text-xs tracking-wider">LANGUAGE</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="dark:bg-[#0D0F1A] dark:border-[#2C2F3C] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-none">
                      <SelectItem value="en" className="text-white hover:bg-[#2C2F3C]">
                        English
                      </SelectItem>
                      <SelectItem value="es" className="text-white hover:bg-[#2C2F3C]">
                        Español
                      </SelectItem>
                      <SelectItem value="fr" className="text-white hover:bg-[#2C2F3C]">
                        Français
                      </SelectItem>
                      <SelectItem value="de" className="text-white hover:bg-[#2C2F3C]">
                        Deutsch
                      </SelectItem>
                      <SelectItem value="ja" className="text-white hover:bg-[#2C2F3C]">
                        日本語
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#A0AFC0] uppercase text-xs tracking-wider">CURRENCY</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="dark:bg-[#0D0F1A] dark:border-[#2C2F3C] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-none">
                      <SelectItem value="USD" className="text-white hover:bg-[#2C2F3C]">
                        USD ($)
                      </SelectItem>
                      <SelectItem value="EUR" className="text-white hover:bg-[#2C2F3C]">
                        EUR (€)
                      </SelectItem>
                      <SelectItem value="GBP" className="text-white hover:bg-[#2C2F3C]">
                        GBP (£)
                      </SelectItem>
                      <SelectItem value="JPY" className="text-white hover:bg-[#2C2F3C]">
                        JPY (¥)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#A0AFC0] uppercase text-xs tracking-wider">DATE FORMAT</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger className="dark:bg-[#0D0F1A] dark:border-[#2C2F3C] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-none">
                        <SelectItem value="MM/DD/YYYY" className="text-white hover:bg-[#2C2F3C]">
                          MM/DD/YYYY
                        </SelectItem>
                        <SelectItem value="DD/MM/YYYY" className="text-white hover:bg-[#2C2F3C]">
                          DD/MM/YYYY
                        </SelectItem>
                        <SelectItem value="YYYY-MM-DD" className="text-white hover:bg-[#2C2F3C]">
                          YYYY-MM-DD
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#A0AFC0] uppercase text-xs tracking-wider">TIME FORMAT</Label>
                    <Select value={timeFormat} onValueChange={setTimeFormat}>
                      <SelectTrigger className="dark:bg-[#0D0F1A] dark:border-[#2C2F3C] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-none">
                        <SelectItem value="12" className="text-white hover:bg-[#2C2F3C]">
                          12 Hour
                        </SelectItem>
                        <SelectItem value="24" className="dark:text-white dark:hover:bg-[#2C2F3C]">
                          24 Hour
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Performance */}
          <Card className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <Settings className="h-5 w-5 text-[#00E5FF]" />
                <span>DATA & PERFORMANCE</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Auto Refresh</h4>
                    <p className="text-[#A0AFC0] text-sm">Automatically refresh data periodically</p>
                  </div>
                  <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>

                {autoRefresh && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[#A0AFC0] uppercase text-xs tracking-wider">REFRESH INTERVAL</Label>
                      <span className="text-white font-medium">{refreshInterval[0]} seconds</span>
                    </div>
                    <Slider
                      value={refreshInterval}
                      onValueChange={setRefreshInterval}
                      max={300}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-[#A0AFC0]">
                      <span>10s</span>
                      <span>5min</span>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg dark:bg-[#0D0F1A] border dark:border-[#2C2F3C] border-[#E5E7EB]">
                  <h4 className="text-white font-medium mb-2">Data Usage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#A0AFC0]">Cache Size:</span>
                      <span className="text-white">24.5 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A0AFC0]">Last Cleared:</span>
                      <span className="text-white">2 days ago</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF]"
                  >
                    Clear Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 font-bold uppercase tracking-wide px-8"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "SAVING..." : "SAVE PREFERENCES"}
          </Button>
        </div>
      </div>
    </div>
  )
}
