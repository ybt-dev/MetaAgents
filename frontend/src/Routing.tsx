import { Route, Routes } from 'react-router';
import AuthorizedSection from '@/components/AuthorizedSection';
import NonAuthorizedSection from '@/components/NonAuthorizedSection';
import Home from './routes/home';
import AgentTeamDetails from './routes/agent-team-details';
import AgentTeamsPage from './routes/agent-teams';
import Agents from './routes/agents';
import AgentDetails from './routes/agent-details';
import TeamSettings from './routes/team-settings';
import TeamInteractions from './routes/team-interactions';
import TeamInteractionDetails from './routes/team-interaction-details';
import Logout from './routes/logout';

const Routing = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <NonAuthorizedSection>
            <Home />
          </NonAuthorizedSection>
        }
      />
      <Route
        path="/agent-teams/:agentTeamId"
        element={
          <AuthorizedSection>
            <AgentTeamDetails />
          </AuthorizedSection>
        }
      >
        <Route path="agents" element={<Agents />}>
          <Route path=":agentId" element={<AgentDetails />} />
        </Route>
        <Route path="interactions">
          <Route index element={<TeamInteractions />} />
          <Route path=":interactionId" element={<TeamInteractionDetails />} />
        </Route>
        <Route path="settings" element={<TeamSettings />} />
      </Route>
      <Route
        path="/agent-teams"
        element={
          <AuthorizedSection>
            <AgentTeamsPage />
          </AuthorizedSection>
        }
      />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default Routing;
