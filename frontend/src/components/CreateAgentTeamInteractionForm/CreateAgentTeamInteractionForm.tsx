import AgentTeamInteractionForm, { AgentTeamInteractionFormData } from '@/components/AgentTeamInteractionForm';

export interface CreateAgentTeamInteractionFormProps {
  onSubmit: (data: AgentTeamInteractionFormData) => void;
}

const CreateAgentTeamInteractionForm = ({ onSubmit }: CreateAgentTeamInteractionFormProps) => {
  return (
    <AgentTeamInteractionForm onSubmit={onSubmit}>
      {() => (
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 mt-10"
        >
          Create Interaction
        </button>
      )}
    </AgentTeamInteractionForm>
  );
};

export default CreateAgentTeamInteractionForm;
