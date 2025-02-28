import { messageCompletionFooter } from '@elizaos/core';

export const defaultInteractionsTemplate = `
{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
{{agentName}} can make decisions and perform actions based on their role. If communication with other agents in the team is necessary, they are allowed to interact with them.

{{messageDirections}}

{{recentMessages}}

{{actions}}

# System Information (IMPORTANT)
{{systemMessage}}

# Instructions: Write the next message for {{agentName}}.
${messageCompletionFooter}
`;
