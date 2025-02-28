import { Link, useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Agent } from '@/api/AgentsApi';
import useListLatestInteractionMessagesQuery from '@/hooks/queries/useListLatestInteractionMessagesQuery.ts';
import useAgentTeamInteractionByIdQuery from '@/hooks/queries/useAgentTeamInteractionByIdQuery';
import useListAgentsByTeamIdQuery from '@/hooks/queries/useListAgentsByTeamIdQuery';
import useReplyAgentTeamInteraction from '@/hooks/mutations/useReplyAgentTeamInteraction';
import InteractionMessagesList from '@/components/InteractionMessagesList';
import Skeleton from '@/components/Skeleton';
import TypingIndicator from '@/components/TypingIndicator';
import MessageInput from '@/components/MessageInput';

const TIMER_ID_INTERVAL = 1000 * 20; // 20 seconds in ms

const TeamInteractionDetails = () => {
  const { interactionId, agentTeamId } = useParams<{ interactionId: string; agentTeamId: string }>();

  const { data: messages } = useListLatestInteractionMessagesQuery(interactionId || '');
  const { data: agents } = useListAgentsByTeamIdQuery(agentTeamId || '');
  const { data: agentTeamInteraction } = useAgentTeamInteractionByIdQuery(interactionId || '');

  const [, setTimerId] = useState<number>(0);

  const { mutateAsync: replyAgentTeamInteraction } = useReplyAgentTeamInteraction();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimerId((prevTimeId) => prevTimeId + 1);
    }, TIMER_ID_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSendMessage = async (messageContent: string) => {
    if (!interactionId) {
      return;
    }

    await replyAgentTeamInteraction({ id: interactionId, content: messageContent });
  };

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

  const now = Date.now();
  const isLocked = !!agentTeamInteraction?.lockedTill && new Date(agentTeamInteraction.lockedTill).getTime() > now;

  return (
    <div className="absolute top-0 right-0 flex flex-col h-full w-full">
      <div className="flex flex-col overflow-y-auto p-10">
        <Link to=".." className="flex items-center text-blue-500 hover:text-blue-400 mb-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Interactions
        </Link>
        <div className="flex flex-col gap-6 mb-4">{renderMessageDetails()}</div>
        <InteractionMessagesList agentsPool={agentsPool} messages={messages ?? null} />
        {messages && isLocked && <TypingIndicator className="mt-8" />}
        {messages && !messages.length && <p className="text-white">No messages found.</p>}
      </div>
      <MessageInput
        disabled={!agentTeamInteraction || isLocked}
        className="mt-auto"
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default TeamInteractionDetails;
