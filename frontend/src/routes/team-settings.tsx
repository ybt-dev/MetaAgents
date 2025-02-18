import { useState } from 'react';
import { useParams } from 'react-router';
import { AgentTeamFormData } from '@/components/AgentTeamForm';
import useAgentTeamByIdQuery from '@/hooks/queries/useAgentTeamByIdQuery';
import useUpdateAgentTeamMutation from '@/hooks/mutations/useUpdateAgentTeamMutation';
import AgentTeamSettingsOverview from '@/components/AgentTeamSettingsOverview';
import EditAgentTeamForm from '@/components/EditAgentTeamForm';

const TeamSettings = () => {
  const [editMode, setEditMode] = useState(false);

  const { agentTeamId } = useParams<{ agentTeamId: string }>();

  const { data: agentTeam } = useAgentTeamByIdQuery(agentTeamId || '');
  const { mutateAsync: updateAgentTeam } = useUpdateAgentTeamMutation();

  const handleSubmitEditAgentTeamForm = async (data: AgentTeamFormData) => {
    if (!agentTeamId) {
      return;
    }

    await updateAgentTeam({
      id: agentTeamId,
      name: data.name,
      description: data.description,
      strategy: data.strategy,
    });

    setEditMode(false);
  };

  return (
    <div className="w-2/3">
      {editMode && agentTeam ? (
        <EditAgentTeamForm
          agentTeam={agentTeam}
          onSubmit={handleSubmitEditAgentTeamForm}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <AgentTeamSettingsOverview agentTeam={agentTeam ?? null} onEditButtonClick={() => setEditMode(true)} />
      )}
    </div>
  );
};

export default TeamSettings;
