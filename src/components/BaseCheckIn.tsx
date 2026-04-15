import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Wallet, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

// Mock contract for demo purposes
const CHECKIN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with real contract
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
  const { disconnect } = useDisconnect();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const handleCheckIn = async () => {
    try {
      // In a real app, we would call the contract
      // writeContract({
      //   address: CHECKIN_CONTRACT_ADDRESS,
      //   abi: ABI,
      //   functionName: 'checkIn',
      // });
      
      // For demo, we'll simulate success
      setHasCheckedIn(true);
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

  return (
    <div className="space-y-4">
      {hasCheckedIn ? (
        <div className="flex items-center gap-3 text-leaf-green font-bold bg-white p-4 rounded-2xl border-2 border-leaf-green shadow-sm">
          <CheckCircle size={24} />
          Checked in for today!
        </div>
      ) : (
        <Button 
          onClick={handleCheckIn}
          disabled={isPending}
          className="w-full bg-base-blue hover:bg-blue-700 text-white rounded-full py-7 text-lg font-bold shadow-[0_10px_20px_rgba(0,82,255,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isPending ? (
            <Loader2 className="mr-2 animate-spin" size={20} />
          ) : (
            <CheckCircle className="mr-2" size={20} />
          )}
          Daily Check-in
        </Button>
      )}
      <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
        0.0001 ETH Gas • Base Mainnet
      </p>
    </div>
  );
}
