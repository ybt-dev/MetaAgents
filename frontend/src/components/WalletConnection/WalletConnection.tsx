import { useWallet } from '@initia/react-wallet-widget';
import { truncate } from '@/utils';

const WalletConnection = () => {
  const { address, onboard, view, account } = useWallet();

  const handleConnectButtonClick = () => {
    if (!account) {
      onboard();
    } else {
      view();
    }
  };

  return (
    <div className="relative">
      <div className="w-28 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 hover:bg-gray-700">
        <button onClick={handleConnectButtonClick} className="w-full px-4 py-2 text-sm text-white">
          {account ? truncate(address) : 'Connect'}
        </button>
      </div>
    </div>
  );
};

export default WalletConnection;
