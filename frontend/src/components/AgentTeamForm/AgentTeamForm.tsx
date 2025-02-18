import { FormEvent, ReactNode, useState } from 'react';
import { tailwindClsx } from '@/utils';

export interface AgentTeamFormData {
  name: string;
  description: string;
  strategy: string;
}

export interface AgentTeamFormProps {
  className?: string;
  innerContainerClassName?: string;
  header?: ReactNode;
  initialData?: AgentTeamFormData;
  onSubmit: (data: AgentTeamFormData) => void;
  children: (data: AgentTeamFormData) => ReactNode;
}

const AgentTeamForm = ({
  className,
  innerContainerClassName,
  header,
  initialData,
  onSubmit,
  children,
}: AgentTeamFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [strategy, setStrategy] = useState(initialData?.strategy || '');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit({
      name,
      description,
      strategy,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={tailwindClsx('rounded-lg bg-gray-800 text-gray-100 overflow-hidden', className)}
    >
      {header}
      <div className={tailwindClsx('space-y-6', innerContainerClassName)}>
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-400">
            Team Name
          </label>
          <input
            required
            type="text"
            id="teamName"
            name="teamName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-400">
            Description
          </label>
          <textarea
            required
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="strategy" className="block text-sm font-medium text-gray-400">
            Strategy
          </label>
          <textarea
            required
            id="strategy"
            name="strategy"
            value={strategy}
            onChange={(event) => setStrategy(event.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      {children({
        name,
        description,
        strategy,
      })}
    </form>
  );
};

export default AgentTeamForm;
