import { Loader2 } from "lucide-react"

export const DefaultPendingComponent = () => {
    return <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin mx-auto mt-20 h-8 w-8 text-muted-foreground" />
    </div>
}