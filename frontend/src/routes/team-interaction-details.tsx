import { Link, useParams } from 'react-router';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Agent } from '@/api/AgentsApi';
import useListLatestInteractionMessagesQuery from '@/hooks/queries/useListLatestInteractionMessagesQuery.ts';
import useAgentTeamInteractionByIdQuery from '@/hooks/queries/useAgentTeamInteractionByIdQuery';
import InteractionMessagesList from '@/components/InteractionMessagesList';
import Skeleton from '@/components/Skeleton';
import useListAgentsByTeamIdQuery from '@/hooks/queries/useListAgentsByTeamIdQuery';

const TeamInteractionDetails = () => {
  const { interactionId, agentTeamId } = useParams<{ interactionId: string; agentTeamId: string }>();

  const { data: messages } = useListLatestInteractionMessagesQuery(interactionId || '');
  const { data: agents } = useListAgentsByTeamIdQuery(agentTeamId || '');
  const { data: agentTeamInteraction } = useAgentTeamInteractionByIdQuery(interactionId || '');

  const agentsPool = useMemo(() => {
    return (agents || []).reduce(
      (pool, agent) => {
        pool[agent.id] = agent;

        return pool;
      },
      {} as Record<string, Agent>,
    );
  }, [agents]);

  const renderMessageDetails = () => {
    if (!agentTeamInteraction) {
      return (
        <>
          <Skeleton className="h-8 w-3/4" />
        </>
      );
    }

    return (
      <>
        <h1 className="text-2xl font-bold text-white">{agentTeamInteraction.title}</h1>
      </>
    );
  };

  return (
    <div className="flex flex-col">
      <Link to=".." className="flex items-center text-blue-500 hover:text-blue-400 mb-4">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Interactions
      </Link>
      <div className="flex flex-col gap-6 mb-4">{renderMessageDetails()}</div>
      <InteractionMessagesList agentsPool={agentsPool} messages={messages ?? null} />
      {messages && !messages.length && <p className="text-white">No messages found.</p>}
    </div>
  );
};

export default TeamInteractionDetails;
