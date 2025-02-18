import AgentTeamForm, { AgentTeamFormData } from '@/components/AgentTeamForm';

export interface CreateAgentTeamFormProps {
  onSubmit: (data: AgentTeamFormData) => void;
}

const CreateAgentTeamForm = ({ onSubmit }: CreateAgentTeamFormProps) => {
  return (
    <AgentTeamForm onSubmit={onSubmit}>
      {() => (
        <button
          type="submit"
          className="px-4 mt-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Create Agent Team
        </button>
      )}
    </AgentTeamForm>
  );
};

export default CreateAgentTeamForm;
