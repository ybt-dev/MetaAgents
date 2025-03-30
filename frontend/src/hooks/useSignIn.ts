import { useAddress, useWallet } from '@initia/react-wallet-widget';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import useCreateSessionMutation from '@/hooks/mutations/useCreateSessionMutation';
import useCreateSessionNonceMutation from '@/hooks/mutations/useCreateSessionNonceMutation';
import useSession from '@/hooks/useSession';

const useSignIn = () => {
  const { signArbitrary, account, wallet } = useWallet();

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

      if (wallet?.type === 'evm') {
        const preparedMessage = `${address} wants to sign in with nonce: ${nonce}`;
        const message = new TextEncoder().encode(preparedMessage);

        const signature = await signArbitrary(message);

        // Convert Uint8Array pubkey to base64 string
        const pubKeyBase64 = btoa(String.fromCharCode.apply(null, Array.from(account?.pubkey || new Uint8Array())));

        console.log('Creating session with payload:', {
          signature,
          message: preparedMessage,
          pubKey: pubKeyBase64,
          nonce,
        });

        console.log('Account details:', {
          address,
          pubkey: account?.pubkey,
          pubKeyBase64,
        });

        await createSession({
          signature: signature || '',
          message: preparedMessage,
          pubKey: pubKeyBase64,
          nonce,
          provider: 'evm',
        });
      } else if (wallet?.type === 'initia') {
        const preparedMessage = 'Sign in with Initia to the MetaAgents';
        const message = new TextEncoder().encode('Sign in with Initia to the MetaAgents');

        const signature = await signArbitrary(message);

        await createSession({
          signature: signature || '',
          message: preparedMessage,
          pubKey: account?.pubkey.toString() || '',
          nonce,
          provider: 'initia',
        });
      }

      console.log('Signing in with wallet type:', wallet?.type);
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  }, [currentUserId, account, address, wallet?.type]);
};

export default useSignIn;
