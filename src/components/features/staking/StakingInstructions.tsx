import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { WalletIcon, WalletIconList } from '@/components/ui/WalletIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STEPS = [
  {
    title: 'Connect your wallet',
    description: 'Choose your preferred wallet from the options below',
    wallets: ['phantom', 'solflare', 'metamask', 'ledger'],
  },
  {
    title: 'Navigate to Staking',
    description: 'Go to the Staking section in your dashboard',
    icon: '📊',
  },
  {
    title: 'Enter stake amount',
    description: 'Input the amount of ANT tokens you want to stake',
    icon: '🔢',
  },
  {
    title: 'Review terms',
    description: 'Check the staking terms and current APY',
    icon: '📝',
  },
  {
    title: 'Confirm transaction',
    description: 'Approve the transaction in your wallet',
    icon: '✅',
  },
];

export function StakingInstructions() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedWallet, setSelectedWallet] = React.useState<string | null>(null);

  const handleWalletSelect = (wallet: string) => {
    setSelectedWallet(wallet);
    setActiveStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Start Staking ANT Tokens
        </h2>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Staking your ANT tokens is simple and secure
        </p>
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
          <div 
            className="absolute left-0 top-0 h-full bg-primary-500 transition-all duration-500 ease-in-out"
            style={{ width: '100%', height: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="space-y-12">
          {STEPS.map((step, index) => (
            <div key={index} className="relative flex group">
              <div className="flex-shrink-0 z-10">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${
                  index <= activeStep 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  {index === 0 ? (
                    <div className="w-8 h-8">
                      {selectedWallet ? (
                        <WalletIcon 
                          wallet={selectedWallet as any} 
                          size={32} 
                          className="w-full h-full"
                        />
                      ) : (
                        <span className="text-2xl">👛</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-2xl">{step.icon}</span>
                  )}
                </div>
              </div>
              <div className="ml-6 pb-12">
                <h3 className={`text-lg font-medium ${
                  index <= activeStep 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
                
                {index === 0 && activeStep === 0 && (
                  <div className="mt-4">
                    <WalletIconList 
                      wallets={step.wallets as any} 
                      onWalletSelect={handleWalletSelect}
                      className="mt-4"
                    />
                  </div>
                )}
                
                {index === 0 && selectedWallet && (
                  <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Connected with {selectedWallet}
                  </div>
                )}
                
                {index === STEPS.length - 1 && activeStep === STEPS.length - 1 && (
                  <Button className="mt-4" size="lg">
                    Start Staking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-900/10">
          <CardHeader>
            <CardTitle className="text-primary-600 dark:text-primary-300">High APY</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">Up to 12.5%</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Competitive staking rewards</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-300">Secure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">100% Safe</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Non-custodial staking</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/10">
          <CardHeader>
            <CardTitle className="text-purple-600 dark:text-purple-300">Flexible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">No Lock-up</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Unstake anytime</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
