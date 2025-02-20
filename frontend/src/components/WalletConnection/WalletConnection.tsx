import { useWallet } from '@initia/react-wallet-widget';
import { shortenAddress } from '@/helpers/shorter.ts';

const WalletConnection = () => {
  const { address, onboard, view, account } = useWallet();

  const handler = async () => {
    try {
      if (!account) {
        onboard();
      } else {
        view();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative">
      <div className="w-28 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 hover:bg-gray-700">
        <button onClick={handler} className="w-full px-4 py-2 text-sm text-white">
          {account ? shortenAddress(address) : 'Connect'}
        </button>
      </div>
    </div>
  );
};

export default WalletConnection;
