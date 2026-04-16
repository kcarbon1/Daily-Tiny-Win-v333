import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData, stringToHex } from 'viem';
import { injected } from 'wagmi/connectors';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Wallet, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

// Replace this address with your deployed contract address from Remix
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
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
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

      writeContract({
        address: CHECKIN_CONTRACT_ADDRESS as `0x${string}`,
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
            disabled={isWorking || CHECKIN_CONTRACT_ADDRESS.startsWith('0x000')}
            className="w-full bg-base-blue hover:bg-blue-700 text-white rounded-full py-7 text-lg font-bold shadow-[0_10px_20px_rgba(0,82,255,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          >
            {isWorking ? (
              <Loader2 className="mr-2 animate-spin" size={20} />
            ) : (
              <CheckCircle className="mr-2" size={20} />
            )}
            {isConfirming ? 'Confirming...' : 'Daily Check-in'}
          </Button>
          
          {CHECKIN_CONTRACT_ADDRESS.startsWith('0x000') && (
            <p className="text-[10px] text-orange-500 text-center font-bold">
              ⚠️ Set contract address in BaseCheckIn.tsx
            </p>
          )}

          {error && (
            <p className="text-[10px] text-red-500 text-center font-medium">
              Error: {error.message.includes('User rejected') ? 'Transaction rejected' : 'Something went wrong'}
            </p>
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
