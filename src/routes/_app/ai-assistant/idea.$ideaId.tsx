import { AIChatInputBox } from '@/components/chat/AIChatInputBox';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AIConversation } from '@/domain/AIConversation';
import { Idea } from '@/domain/Idea';
import { formatDate } from '@/lib/utils';
import { createConversation, getConversationsByIdea } from '@/server-functions/chat';
import { getIdeaById } from '@/server-functions/ideas';
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_app/ai-assistant/idea/$ideaId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const ideaData = await getIdeaById({ data: { id: params.ideaId } })

    if (!ideaData) {
      throw notFound();
    }

    return {
      ideaData: ideaData,
      conversationsData: await getConversationsByIdea({ data: { ideaId: Number(params.ideaId) } }),
    }
  }
})

function RouteComponent() {
  const { conversationsData, ideaData } = Route.useLoaderData();
  const userId = Route.useRouteContext().user?.id!;
  const navigate = Route.useNavigate();

  const conversations = conversationsData.map(AIConversation.fromJSONData);
  const idea = Idea.fromJSONData(ideaData);

  return <div className='max-w-2xl mx-auto'>
    <div className='pb-6'>
      <Button asChild variant="link" className='px-0 py-0'>
        <Link to='/ai-assistant'>
          <ArrowLeft />
          Go Back
        </Link>
      </Button>
      <h1 className='text-xl font-bold'>{idea.getTitle()}</h1>
    </div>

    <div className='flex flex-col gap-4 mt-6'>

      <AIChatInputBox
        className='w-full'
        placeholder="Start a new conversation about this idea..."
        name='prompt'
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem('prompt') as HTMLInputElement;
          const message = input.value.trim();

          const newConversation = await createConversation({

            data: {
              title: "New chat",
              idea_id: Number(idea.getId()),
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
  </div >
}