import { useWallet } from '@initia/react-wallet-widget';
import { shortenAddress } from '@/helpers/shorter.ts';

const WalletConnection = () => {
  const { address, onboard, view } = useWallet();

  const handler = async () => {
    try {
      if (address.length > 0) {
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
      <button onClick={handler}>{address.length > 0 ? shortenAddress(address) : 'Connect'}</button>
    </div>
  );
};

export default WalletConnection;
