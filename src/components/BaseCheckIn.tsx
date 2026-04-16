import { useEffect, useState } from 'react';
import { useAccount, useConnect, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData, stringToHex } from 'viem';
import { injected } from 'wagmi/connectors';
import { Button } from './ui/button';
import { Wallet, CheckCircle, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

// Your contract address
const CHECKIN_CONTRACT_ADDRESS = '0x7cC00ACC3E0Ef33e6c2a2e810545CC741C1a2e68'; 
const BUILDER_CODE = 'bc_u5a7nkor';

const ABI = [
  {
    name: 'checkIn',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
] as const;

export function BaseCheckIn() {
  const { isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });

  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    if (isConfirmed) {
      setHasCheckedIn(true);
    }
  }, [isConfirmed]);

  const handleCheckIn = async () => {
    try {
      // Encode function call
      const calldata = encodeFunctionData({
        abi: ABI,
        functionName: 'checkIn',
      });

      // Append hex-encoded builder code per Base documentation
      const builderCodeHex = stringToHex(BUILDER_CODE).slice(2);
      const dataWithBuilderCode = `${calldata}${builderCodeHex}` as `0x${string}`;

      sendTransaction({
        to: CHECKIN_CONTRACT_ADDRESS as `0x${string}`,
        data: dataWithBuilderCode,
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!isConnected) {
    return (
      <Button 
        onClick={() => connect({ connector: injected() })}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-6"
      >
        <Wallet className="mr-2" size={20} />
        Connect Wallet to Check-in on Base
      </Button>
    );
  }

  const isWorking = isPending || isConfirming;

  return (
    <div className="space-y-4">
      {hasCheckedIn ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-leaf-green font-bold bg-white p-4 rounded-2xl border-2 border-leaf-green shadow-sm text-sm">
            <CheckCircle size={20} />
            Checked in on Base!
          </div>
          {hash && (
            <a 
              href={`https://basescan.org/tx/${hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[10px] text-slate-400 hover:text-base-blue transition-colors font-bold uppercase tracking-widest"
            >
              View on Basescan <ExternalLink size={10} />
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Button 
            onClick={handleCheckIn}
            disabled={isWorking}
            className="w-full bg-base-blue hover:bg-blue-700 text-white rounded-full py-7 text-lg font-bold shadow-[0_10px_20px_rgba(0,82,255,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          >
            {isWorking ? (
              <Loader2 className="mr-2 animate-spin" size={20} />
            ) : (
              <CheckCircle className="mr-2" size={20} />
            )}
            {isConfirming ? 'Confirming...' : (isPending ? 'Check your wallet' : 'Daily Check-in')}
          </Button>

          {error && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase tracking-tight">
                <AlertCircle size={12} />
                <span>Transaction Failed</span>
              </div>
              <p className="text-[9px] text-slate-400 max-w-[200px] text-center leading-tight">
                {error.message.includes('User rejected') 
                  ? 'User canceled transaction' 
                  : (error.message.includes('ChainMismatch') 
                    ? 'Switch to Base Mainnet in your wallet'
                    : error.message.split('\n')[0].slice(0, 60) + '...')}
              </p>
            </div>
          )}
        </div>
      )}
      
      {!hasCheckedIn && (
        <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
          ~0.0001 ETH Gas • Base Mainnet
        </p>
      )}
    </div>
  );
}
