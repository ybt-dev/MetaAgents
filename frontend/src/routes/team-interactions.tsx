import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { Plus } from 'lucide-react';
import { AgentTeamInteractionFormData } from '@/components/AgentTeamInteractionForm';
import useCreateAgentTeamInteractionMutation from '@/hooks/mutations/useCreateAgentTeamInteractionMutation';
import AgentTeamInteractionsList from '@/components/AgentTeamInteractionsList';
import useListAgentTeamInteractionsQuery from '@/hooks/queries/useListAgentTeamInteractionsQuery.ts';
import Popup from '@/components/Popup';
import CreateAgentTeamInteractionForm from '@/components/CreateAgentTeamInteractionForm';

const TeamInteractions = () => {
  const [displayCreateAgentTeamInteractionPopup, setDisplayCreateAgentTeamInteractionPopup] = useState(false);

  const teamId = useOutletContext<string>();

  const navigate = useNavigate();

  const { data: agentTeamInteractions } = useListAgentTeamInteractionsQuery(teamId);

  const { mutateAsync: createAgentTeamInteraction } = useCreateAgentTeamInteractionMutation();

  const showAgentTeamInteractionPopup = () => setDisplayCreateAgentTeamInteractionPopup(true);
  const hideAgentTeamInteractionPopup = () => setDisplayCreateAgentTeamInteractionPopup(false);

  const getAgentTeamInteractionsLink = (interactionId: string) => {
    return `/agent-teams/${teamId}/interactions/${interactionId}`;
  };

  const handleCreateAgentTeamInteractionSubmit = async (data: AgentTeamInteractionFormData) => {
    const interaction = await createAgentTeamInteraction({
      teamId,
      title: data.title,
      requestContent: data.requestContent,
    });

    navigate(getAgentTeamInteractionsLink(interaction.id));

    hideAgentTeamInteractionPopup();
  };

  return (
    <div className="flex flex-col w-full text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Interactions</h1>
        <button
          disabled={!agentTeamInteractions}
          onClick={showAgentTeamInteractionPopup}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Interaction
        </button>
      </div>
      <AgentTeamInteractionsList
        interactions={agentTeamInteractions ?? null}
        getAgentTeamInteractionsLink={getAgentTeamInteractionsLink}
      />
      {agentTeamInteractions && !agentTeamInteractions.length && (
        <div className="text-center text-gray-400 m-auto">No interactions found.</div>
      )}
      <Popup
        isOpen={displayCreateAgentTeamInteractionPopup}
        onClose={hideAgentTeamInteractionPopup}
        title="Create Interaction"
      >
        <CreateAgentTeamInteractionForm onSubmit={handleCreateAgentTeamInteractionSubmit} />
      </Popup>
    </div>
  );
};

export default TeamInteractions;
