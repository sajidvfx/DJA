import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface PinLockProps {
  onUnlock: () => void;
  correctPin: string;
  isSetup?: boolean;
  onSetPin?: (pin: string) => void;
  darkMode: boolean;
}

export const PinLock: React.FC<PinLockProps> = ({ 
  onUnlock, 
  correctPin, 
  isSetup = false, 
  onSetPin,
  darkMode 
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');

  const handleDigit = (digit: string) => {
    setError('');
    if (isSetup) {
      if (step === 'enter' && pin.length < 4) {
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === 4) {
          setStep('confirm');
        }
      } else if (step === 'confirm' && confirmPin.length < 4) {
        const newConfirm = confirmPin + digit;
        setConfirmPin(newConfirm);
        if (newConfirm.length === 4) {
          if (newConfirm === pin) {
            onSetPin?.(newConfirm);
            onUnlock();
          } else {
            setError('PINs do not match. Try again.');
            setPin('');
            setConfirmPin('');
            setStep('enter');
          }
        }
      }
    } else {
      if (pin.length < 4) {
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === 4) {
          if (newPin === correctPin) {
            onUnlock();
          } else {
            setError('Incorrect PIN');
            setPin('');
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setError('');
    if (isSetup && step === 'confirm') {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
  };

  const currentPin = isSetup && step === 'confirm' ? confirmPin : pin;

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-6",
      darkMode ? "bg-gray-900" : "bg-gradient-to-br from-indigo-500 to-purple-600"
    )}>
      <div className={cn(
        "w-full max-w-sm rounded-3xl p-8 shadow-2xl",
        darkMode ? "bg-gray-800" : "bg-white/95 backdrop-blur"
      )}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📔</div>
          <h1 className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-gray-800"
          )}>
            {isSetup ? 'Set Your PIN' : 'My Daily Diary'}
          </h1>
          <p className={cn(
            "text-sm mt-2",
            darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {isSetup 
              ? (step === 'enter' ? 'Create a 4-digit PIN' : 'Confirm your PIN')
              : 'Enter your PIN to unlock'
            }
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full transition-all",
                currentPin.length > i
                  ? "bg-indigo-500 scale-110"
                  : darkMode ? "bg-gray-600" : "bg-gray-300"
              )}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((digit, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (digit === '⌫') handleDelete();
                else if (digit !== '') handleDigit(String(digit));
              }}
              disabled={digit === ''}
              className={cn(
                "h-16 rounded-2xl text-2xl font-semibold transition-all active:scale-95",
                digit === '' && "invisible",
                digit === '⌫' 
                  ? (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600")
                  : (darkMode 
                      ? "bg-gray-700 text-white hover:bg-gray-600" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    )
              )}
            >
              {digit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
