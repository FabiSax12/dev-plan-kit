import { AIChatInputBox } from '@/components/chat/AIChatInputBox';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AIConversation } from '@/domain/AIConversation';
import { Project } from '@/domain/Project';
import { formatDate } from '@/lib/utils';
import { createConversation, getConversationsByProject } from '@/server-functions/chat';
import { getProjectById } from '@/server-functions/projects';
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_app/ai-assistant/project/$projectId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      projectData: await getProjectById({ data: { id: Number(params.projectId) } }),
      conversationsData: await getConversationsByProject({ data: { projectId: Number(params.projectId) } }),
    }
  }
})

function RouteComponent() {
  const { conversationsData, projectData } = Route.useLoaderData();
  const userId = Route.useRouteContext().user?.id!;
  const navigate = Route.useNavigate();

  const conversations = conversationsData.map(AIConversation.fromJSONData);
  const project = Project.fromJSONData(projectData);

  return <div className='max-w-2xl mx-auto'>
    <div className='pb-6'>
      <Button asChild variant="link" className='px-0 py-0'>
        <Link to='/ai-assistant'>
          <ArrowLeft />
          Go Back
        </Link>
      </Button>
      <h1 className='text-xl font-bold'>{project.getName()}</h1>
    </div>

    <div className='flex flex-col gap-4 mt-6'>

      <AIChatInputBox
        className='w-full'
        placeholder="Start a new conversation about this project..."
        name='prompt'
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem('prompt') as HTMLInputElement;
          const message = input.value.trim();

          const newConversation = await createConversation({

            data: {
              title: "New chat",
              project_id: Number(project.getId()),
              userId: userId,
              initial_messages: [
                {
                  role: 'user',
                  content: message,
                  conversationId: '',
                }
              ]
            }
          });

          form.reset();

          navigate({
            to: '/ai-assistant/conversation/$conversationId',
            params: { conversationId: newConversation.id.toString() }
          });
        }}
      />

      {conversations.length === 0 && (
        <p className='text-center text-muted-foreground'>No conversations yet. Start one by entering a prompt above.</p>
      )}

      {conversations.map(conversation => (
        <Link key={conversation.getId()} to='/ai-assistant/conversation/$conversationId' params={{ conversationId: conversation.getId().toString() }}>
          <Card className="group transition-shadow hover:shadow-md gap-0 h-full">
            <CardHeader>
              <CardTitle>{conversation.getTitle()}</CardTitle>
            </CardHeader>
            <CardFooter>
              <span className='text-xs text-muted-foreground'>{formatDate(conversation.getUpdatedAt())}</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  </div>
}