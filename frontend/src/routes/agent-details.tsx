import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { AgentFormData } from '@/components/AgentForm';
import useUpdateAgentMutation from '@/hooks/mutations/useUpdateAgentMutation';
import useDeleteAgentMutation from '@/hooks/mutations/useDeleteAgentMutation';
import useAgentByIdQuery from '@/hooks/queries/useAgentByIdQuery';
import AgentDetailsOverview from '@/components/AgentDetailsOverview';
import EditAgentForm from '@/components/EditAgentForm';
import Popup from '@/components/Popup';
import ConfirmPopup from '@/components/ConfirmPopup/ConfirmPopup.tsx';

const AgentDetails = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDeleteAgentPopup, setShowConfirmDeleteAgentPopup] = useState(false);

  const navigate = useNavigate();

  const { agentId } = useParams<{ agentId: string }>();

  const { data: agent } = useAgentByIdQuery(agentId || '');

  const { mutateAsync: updateAgent } = useUpdateAgentMutation();
  const { mutateAsync: deleteAgent } = useDeleteAgentMutation();

  const handleUpdateAgent = async (data: AgentFormData) => {
    if (!agentId) {
      return;
    }

    await updateAgent({
      id: agentId,
      name: data.name,
      description: data.description,
      modelApiKey: data.modelApiKey,
      model: data.model,
      twitterAuthToken: data.twitterAuthToken,
      twitterUsername: data.twitterUsername,
      twitterPassword: data.twitterPassword,
      twitterEmail: data.twitterEmail,
    });

    setIsEditMode(false);
  };

  const handleConfirmDeleteAgent = async () => {
    if (!agentId) {
      return;
    }

    const deletedAgent = await deleteAgent(agentId);

    setShowConfirmDeleteAgentPopup(false);

    navigate(`/agent-teams/${deletedAgent.teamId}/agents`);
  };

  return (
    <div className="h-full w-2/3">
      {isEditMode && agent ? (
        <EditAgentForm agent={agent} onCancel={() => setIsEditMode(false)} onSubmit={handleUpdateAgent} />
      ) : (
        <AgentDetailsOverview
          agent={agent ?? null}
          onEditButtonClick={() => setIsEditMode(true)}
          onDeleteButtonClick={() => setShowConfirmDeleteAgentPopup(true)}
        />
      )}
      <Popup
        title="Delete Agent"
        isOpen={showConfirmDeleteAgentPopup}
        onClose={() => setShowConfirmDeleteAgentPopup(false)}
      >
        Are you sure you want to delete this agent?
      </Popup>
      <ConfirmPopup
        isOpen={showConfirmDeleteAgentPopup}
        onClose={() => setShowConfirmDeleteAgentPopup(false)}
        onConfirm={handleConfirmDeleteAgent}
        title="Delete Agent"
        message="Are you sure you want to delete this agent? This action cannot be undone."
      />
    </div>
  );
};

export default AgentDetails;
