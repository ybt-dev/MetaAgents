import { useMemo } from 'react';
import { BrowserRouter } from 'react-router';
import { WalletWidgetProvider } from '@initia/react-wallet-widget';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import { RestApiClient } from './api/ApiClient';
import Header from './components/Header';
import Routing from './Routing';
import AppInitializer from './AppInitializer';
import { ApiProvider } from './providers/ApiProvider';
import SessionsRestApi from './api/SessionsApi';
import AgentTeamsRestApi from './api/AgentTeamsApi';
import AgentsRestApi from './api/AgentsApi';
import AgentTeamInteractionsRestApi from './api/AgentTeamInteractionsApi';
import InteractionMessagesRestApi from './api/InteractionMessagesApi.ts';

import './tailwind.css';

function App() {
  const queryClient = useMemo(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          toast.error(error.message);
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => toast.error(error.message),
      }),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchIntervalInBackground: false,
        },
      },
    });
  }, []);

  const services = useMemo(() => {
    const apiClient = new RestApiClient(import.meta.env.VITE_API_URL);

    return {
      sessionsApi: new SessionsRestApi(apiClient),
      agentTeamsApi: new AgentTeamsRestApi(apiClient),
      agentTeamInteractionsApi: new AgentTeamInteractionsRestApi(apiClient),
      agentApi: new AgentsRestApi(apiClient),
      interactionMessagesApi: new InteractionMessagesRestApi(apiClient),
    };
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <WalletWidgetProvider>
          <ApiProvider value={services}>
            <AppInitializer>
              <Header />
              <main className="flex-grow overflow-y-auto">
                <Routing />
              </main>
            </AppInitializer>
          </ApiProvider>
        </WalletWidgetProvider>
      </QueryClientProvider>
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        theme="dark"
        toastStyle={{ zIndex: 1000000 }}
        position="top-right"
      />
    </BrowserRouter>
  );
}

export default App;
