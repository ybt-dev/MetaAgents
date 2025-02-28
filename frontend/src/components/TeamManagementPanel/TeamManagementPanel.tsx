import { Link } from 'react-router';
import { Settings, Users, MessageSquare } from 'lucide-react';
import TeamCategoryId from '@/enums/TeamCategoryId';
import CategoriesList, { Category } from '@/components/TeamManagementPanel/CategoriesList';

export interface TeamManagementPanelProps {
  agentTeamName: string;
  selectedCategoryId: TeamCategoryId;
  onSelectCategory: (categoryId: TeamCategoryId) => void;
  goBackButtonLink: string;
}

const CATEGORIES: Category<TeamCategoryId>[] = [
  {
    id: TeamCategoryId.Agents,
    name: 'Agents',
    icon: Users,
  },
  {
    id: TeamCategoryId.Interactions,
    name: 'Interactions',
    icon: MessageSquare,
  },
  {
    id: TeamCategoryId.Settings,
    name: 'Settings',
    icon: Settings,
  },
];

const TeamManagementPanel = ({
  agentTeamName,
  selectedCategoryId,
  onSelectCategory,
  goBackButtonLink,
}: TeamManagementPanelProps) => {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 min-w-xs text-gray-100">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <span className="font-semibold text-lg">{agentTeamName}</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        <CategoriesList<TeamCategoryId>
          categories={CATEGORIES}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
        />
      </nav>
      <div className="border-t border-gray-800 p-4">
        <Link
          to={goBackButtonLink}
          className="flex w-full items-center justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700 hover:text-white"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default TeamManagementPanel;
