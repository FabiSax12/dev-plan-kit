import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/ai-assistant/conversation/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/ai-assistant/conversation/new"!</div>
}
