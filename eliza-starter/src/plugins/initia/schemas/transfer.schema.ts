import { z } from 'zod';

const initiaTransferSchema = z.object({
  recipient: z.string(),
  amount: z.string().describe('Amount of INITIA to transfer (in uINITIA)'),
});

export default initiaTransferSchema;
