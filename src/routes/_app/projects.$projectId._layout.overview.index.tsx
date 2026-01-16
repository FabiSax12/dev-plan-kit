import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/projects/$projectId/_layout/overview/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='[view-transition-name:main-content]'>
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This project was created to build a modern e-commerce solution. Track progress in the Epics & Stories
          tab.
        </p>
      </CardContent>
    </Card>
  </div>
}
