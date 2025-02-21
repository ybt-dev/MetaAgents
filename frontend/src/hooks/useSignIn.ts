import useAsyncEffect from '@/hooks/useAsyncEffect';
import useCreateSessionMutation from '@/hooks/mutations/useCreateSessionMutation';
import useCreateSessionNonceMutation from '@/hooks/mutations/useCreateSessionNonceMutation';
import useSession from '@/hooks/useSession';
import { useAddress, useWallet } from '@initia/react-wallet-widget';

const useSignIn = () => {
  const { signArbitrary, account } = useWallet();
  const address = useAddress();

  const [currentUser] = useSession();

  const currentUserId = currentUser && currentUser.id;

  const { mutateAsync: createSessionNonce } = useCreateSessionNonceMutation();
  const { mutateAsync: createSession } = useCreateSessionMutation();

  useAsyncEffect(async () => {
    if (!account || address.length == 0 || currentUserId !== null) {
      return;
    }

    try {
      const nonce = await createSessionNonce(address || '');

      const message = new TextEncoder().encode('Sign in with Initia to the MetaAgents');
      const preparedMessage = 'Sign in with Initia to the MetaAgents';

      const hashedMsg = await signArbitrary(message);
      await createSession({
        signature: hashedMsg || '',
        message: preparedMessage,
        pubKey: account?.pubkey.toString() || '',
        nonce,
      });
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  }, [currentUserId, account, address]);
};

export default useSignIn;
