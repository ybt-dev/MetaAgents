import { AgentTeam } from '@/api/AgentTeamsApi';
import AgentTeamForm, { AgentTeamFormData } from '@/components/AgentTeamForm';

export interface EditAgentTeamFormProps {
  agentTeam: AgentTeam;
  onSubmit: (data: AgentTeamFormData) => void;
  onCancel: () => void;
}

const EditAgentTeamForm = ({ agentTeam, onSubmit, onCancel }: EditAgentTeamFormProps) => {
  return (
    <AgentTeamForm
      innerContainerClassName="p-6"
      initialData={{
        name: agentTeam.name,
        description: agentTeam.description,
        strategy: agentTeam.strategy,
      }}
      onSubmit={onSubmit}
    >
      {() => (
        <div className="px-4 pb-4 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Save Changes
          </button>
        </div>
      )}
    </AgentTeamForm>
  );
};

export default EditAgentTeamForm;
