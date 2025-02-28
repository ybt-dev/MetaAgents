import { Trash2 } from 'lucide-react';
import { Agent } from '@/api/AgentsApi';
import Skeleton from '@/components/Skeleton';

export interface AgentDetailsOverviewProps {
  agent: Agent | null;
  onEditButtonClick: () => void;
  onDeleteButtonClick: () => void;
}

const AgentDetailsOverview = ({ agent, onEditButtonClick, onDeleteButtonClick }: AgentDetailsOverviewProps) => {
  return (
    <div className="mt-6 rounded-lg bg-gray-800 text-gray-100 overflow-hidden">
      <div className="flex flex-row justify-between items-center border-b border-gray-700 p-6">
        <h2 className="text-xl font-semibold">Agent Details</h2>
        <div className="flex align-center gap-4">
          <button
            onClick={onDeleteButtonClick}
            className="px-4 py-2 rounded-md bg-red-600/10 text-red-500 hover:bg-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={onEditButtonClick}
            disabled={!agent}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Edit Details
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Agent Name</h3>
            {agent ? <p className="mt-1 text-lg">{agent.name}</p> : <Skeleton className="mt-1 h-10" />}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Agent Role</h3>
            {agent ? <p className="mt-1 text-lg">{agent.role}</p> : <Skeleton className="mt-1 h-10" />}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Agent Description</h3>
            {agent ? <p className="mt-1 text-lg">{agent.description}</p> : <Skeleton className="mt-1 h-24" />}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Model (AI model)</h3>
            {agent ? <p className="mt-1 text-lg">{agent.model}</p> : <Skeleton className="mt-1 h-10" />}
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-400">Model API Key</h3>
            {agent ? <p className="mt-1 text-lg">{agent.modelApiKey}</p> : <Skeleton className="mt-1 h-10" />}
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-400">Wallet Address</h3>
            {agent ? <p className="mt-1 text-lg">{agent.walletAddress}</p> : <Skeleton className="mt-1 h-10" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsOverview;
