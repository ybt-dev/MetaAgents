export const communicationTemplate = `
TASK: Analyze the last message to identify any direct mentions of agents or users using the "@" symbol and determine if communication with the mentioned entities is necessary. Use previous messages only for context.

# INSTRUCTIONS

- Review only the last message to find any mentions in the format "@agentName" or "@user".
- If "@agentName" is detected, prepare a communication message addressed to the specified agent using "actorId": "agent-id" (where "agent-id" is the unique identifier of the agent).
- If "@user" is detected, set "actorId" to "user".
- Ensure that each message includes all necessary context and clearly states the purpose of the communication.

# PROVIDERS
{{providers}}

# START OF ACTUAL TASK INFORMATION

{{recentMessages}}

TASK: Based on the last message, identify direct mentions of agents or users and draft appropriate messages for them. Respond in the following format, ensuring that the response is always wrapped in a markdown JSON block:

RESPONSE FORMAT:
[
  {
    "actorId": "agent-id",
    "text": "Relevant context or instructions"
  },
  {
    "actorId": "user",
    "text": "Relevant context or instructions"
  }
]

Note: Do not put json markdown block in response. Your message should be parseable via JSON.parse() function. (not white space or new lines at the beginning or end of the response)
`;
