export interface AgentTeamCardProps {
  name: string;
  description: string;
  onEditButtonClick: () => void;
}

const AgentTeamCard = ({ name, description, onEditButtonClick }: AgentTeamCardProps) => {
  return (
    <div className="rounded-lg bg-gray-800/50 p-4 hover:bg-gray-800/70 transition-colors gradient-background-animation">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <button
          onClick={onEditButtonClick}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default AgentTeamCard;
