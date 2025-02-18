import { Link } from 'react-router';
import { timeAgo } from '@/globals';

export interface AgentTeamInteractionsListItemProps {
  interactionId: string;
  title: string;
  requestContent: string;
  date: string | Date;
  getAgentTeamInteractionsLink: (interactionId: string) => string;
}

const AgentTeamInteractionsListItem = ({
  interactionId,
  title,
  requestContent,
  date,
  getAgentTeamInteractionsLink,
}: AgentTeamInteractionsListItemProps) => {
  return (
    <Link to={getAgentTeamInteractionsLink(interactionId)}>
      <div className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-2 whitespace-pre-wrap">{requestContent}</p>
        <p className="text-sm text-gray-500">{timeAgo.format(new Date(date))}</p>
      </div>
    </Link>
  );
};

export default AgentTeamInteractionsListItem;
