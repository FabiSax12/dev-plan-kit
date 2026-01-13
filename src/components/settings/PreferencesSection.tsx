import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@radix-ui/react-switch'
import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export const PreferencesSection = () => {
    const [darkMode, setDarkMode] = useState(false)

    return <Card>
        <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                    </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive project updates via email</p>
                </div>
                <Switch defaultChecked />
            </div>
        </CardContent>
    </Card>
}