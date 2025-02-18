import { FormEvent, ReactNode, useState } from 'react';

export interface AgentTeamInteractionFormData {
  title: string;
  requestContent: string;
}

export interface AgentTeamFormProps {
  initialData?: AgentTeamInteractionFormData;
  onSubmit?: (data: AgentTeamInteractionFormData) => void;
  children: (data: AgentTeamInteractionFormData) => ReactNode;
}

const AgentTeamInteractionForm = ({ initialData, onSubmit, children }: AgentTeamFormProps) => {
  const [title, setName] = useState(initialData?.title || '');
  const [requestContent, setRequestContent] = useState(initialData?.requestContent || '');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit?.({
      title,
      requestContent,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-gray-800 text-gray-100 overflow-hidden">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400">
            Title
          </label>
          <input
            required
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="requestContent" className="block text-sm font-medium text-gray-400">
            Content
          </label>
          <textarea
            required
            id="requestContent"
            name="requestContent"
            value={requestContent}
            onChange={(event) => setRequestContent(event.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      {children({
        title,
        requestContent,
      })}
    </form>
  );
};

export default AgentTeamInteractionForm;
