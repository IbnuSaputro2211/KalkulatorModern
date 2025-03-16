// Calculator.tsx
'use client';
import React, { useState, useEffect } from 'react';

// Definisi interface dan tipe
interface ButtonTheme {
  number: string;
  operator: string;
  equal: string;
  clear: string;
  memory: string;
  special: string;
}

interface Theme {
  background: string;
  display: string;
  buttons: ButtonTheme;
}

interface ThemeOptions {
  [key: string]: Theme;
}

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('0');
  const [result, setResult] = useState<string>('');
  const [prevInput, setPrevInput] = useState<string>('');
  const [operator, setOperator] = useState<string>('');
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [theme, setTheme] = useState<string>('blue');
  const [animationState, setAnimationState] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Tema warna untuk kalkulator
  const themes: ThemeOptions = {
    blue: {
      background: 'bg-gradient-to-br from-blue-900 to-indigo-900',
      display: 'bg-slate-800 text-white',
      buttons: {
        number: 'bg-blue-500 hover:bg-blue-600 text-white',
        operator: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        equal: 'bg-green-500 hover:bg-green-600 text-white',
        clear: 'bg-red-500 hover:bg-red-600 text-white',
        memory: 'bg-purple-500 hover:bg-purple-600 text-white',
        special: 'bg-cyan-500 hover:bg-cyan-600 text-white',
      }
    },
    purple: {
      background: 'bg-gradient-to-br from-purple-900 to-pink-900',
      display: 'bg-slate-800 text-white',
      buttons: {
        number: 'bg-purple-500 hover:bg-purple-600 text-white',
        operator: 'bg-pink-600 hover:bg-pink-700 text-white',
        equal: 'bg-green-500 hover:bg-green-600 text-white',
        clear: 'bg-red-500 hover:bg-red-600 text-white',
        memory: 'bg-violet-500 hover:bg-violet-600 text-white',
        special: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white',
      }
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-slate-900',
      display: 'bg-slate-800 text-white',
      buttons: {
        number: 'bg-gray-600 hover:bg-gray-700 text-white',
        operator: 'bg-slate-700 hover:bg-slate-800 text-white',
        equal: 'bg-green-500 hover:bg-green-600 text-white',
        clear: 'bg-red-500 hover:bg-red-600 text-white',
        memory: 'bg-slate-500 hover:bg-slate-600 text-white',
        special: 'bg-slate-400 hover:bg-slate-500 text-white',
      }
    }
  };

  const currentTheme = themes[theme];

  // Deteksi client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Efek animasi latar belakang - hanya dijalankan di client side
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isClient]);

  // Penanganan tombol keyboard - hanya dijalankan di client side
  useEffect(() => {
    if (!isClient) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      
      if (/\d/.test(key)) {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
      } else if (key === '=' || key === 'Enter') {
        handleEqual();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === '.') {
        handleDecimal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, input, result, prevInput, operator, waitingForOperand]);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setInput(num);
      setWaitingForOperand(false);
    } else {
      setInput(input === '0' ? num : input + num);
    }
  };

  const handleOperator = (op: string) => {
    if (operator && !waitingForOperand) {
      handleEqual();
    }
    
    setPrevInput(input);
    setOperator(op);
    setWaitingForOperand(true);
    setResult(`${input} ${op}`);
  };

  const handleEqual = () => {
    if (!operator || waitingForOperand) return;

    let calculatedResult: number;
    const prev = parseFloat(prevInput);
    const current = parseFloat(input);

    switch (operator) {
      case '+':
        calculatedResult = prev + current;
        break;
      case '-':
        calculatedResult = prev - current;
        break;
      case '*':
        calculatedResult = prev * current;
        break;
      case '/':
        calculatedResult = prev / current;
        break;
      case '%':
        calculatedResult = prev % current;
        break;
      case '^':
        calculatedResult = Math.pow(prev, current);
        break;
      default:
        return;
    }

    setInput(calculatedResult.toString());
    setResult(`${prevInput} ${operator} ${input} =`);
    setOperator('');
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setInput('0');
    setResult('');
    setPrevInput('');
    setOperator('');
    setWaitingForOperand(false);
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setInput('0.');
      setWaitingForOperand(false);
    } else if (!input.includes('.')) {
      setInput(input + '.');
    }
  };

  const handleBackspace = () => {
    if (input.length === 1 || (input.length === 2 && input.startsWith('-'))) {
      setInput('0');
    } else {
      setInput(input.slice(0, -1));
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(input) / 100;
    setInput(value.toString());
  };

  const handleSquareRoot = () => {
    const value = Math.sqrt(parseFloat(input));
    setInput(value.toString());
  };

  const handlePower = () => {
    handleOperator('^');
  };

  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(input));
  };

  const handleMemorySubtract = () => {
    setMemory(memory - parseFloat(input));
  };

  const handleMemoryRecall = () => {
    setInput(memory.toString());
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleChangeTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  const getButtonClass = (type: keyof ButtonTheme) => {
    return `${currentTheme.buttons[type]} rounded-full w-12 h-12 m-1 text-xl font-bold shadow-lg transform transition-transform duration-150 active:scale-95`;
  };

  // Buat array statis untuk animasi latar belakang
  const animationBubbles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    size: 50 + (i * 10),
    position: {
      left: `${10 + (i * 8)}%`,
      top: `${15 + (i * 7)}%`,
    }
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-slate-900 to-gray-900">
      <div className={`flex flex-col w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${currentTheme.background} relative`}>
        {/* Animated background - buat hanya di client side */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden">
            {animationBubbles.map((bubble) => (
              <div 
                key={bubble.id}
                className="absolute rounded-full opacity-20 bg-white" 
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  left: bubble.position.left,
                  top: bubble.position.top,
                  transform: `scale(${1 + (Math.sin(animationState / 20 + bubble.id) * 0.2)})`,
                  transition: 'transform 0.5s ease',
                }}
              />
            ))}
          </div>
        )}
        
        {/* Display */}
        <div className="relative z-10 p-4">
          <div className={`${currentTheme.display} rounded-xl p-4 mb-4 shadow-inner`}>
            <div className="text-right text-gray-300 text-sm h-6 overflow-hidden">
              {result}
            </div>
            <div className="text-right text-3xl font-bold h-10 overflow-hidden">
              {input}
            </div>
          </div>
          
          {/* Theme Switcher */}
          <div className="flex justify-end mb-2">
            <button 
              onClick={handleChangeTheme}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-full px-3 py-1 text-xs"
            >
              Ganti Tema
            </button>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-1">
            <button onClick={handleMemoryClear} className={getButtonClass('memory')}>MC</button>
            <button onClick={handleMemoryRecall} className={getButtonClass('memory')}>MR</button>
            <button onClick={handleMemoryAdd} className={getButtonClass('memory')}>M+</button>
            <button onClick={handleMemorySubtract} className={getButtonClass('memory')}>M-</button>

            <button onClick={handleClear} className={getButtonClass('clear')}>C</button>
            <button onClick={handleBackspace} className={getButtonClass('clear')}>⌫</button>
            <button onClick={handlePercentage} className={getButtonClass('special')}>%</button>
            <button onClick={() => handleOperator('/')} className={getButtonClass('operator')}>÷</button>

            <button onClick={() => handleNumber('7')} className={getButtonClass('number')}>7</button>
            <button onClick={() => handleNumber('8')} className={getButtonClass('number')}>8</button>
            <button onClick={() => handleNumber('9')} className={getButtonClass('number')}>9</button>
            <button onClick={() => handleOperator('*')} className={getButtonClass('operator')}>×</button>

            <button onClick={() => handleNumber('4')} className={getButtonClass('number')}>4</button>
            <button onClick={() => handleNumber('5')} className={getButtonClass('number')}>5</button>
            <button onClick={() => handleNumber('6')} className={getButtonClass('number')}>6</button>
            <button onClick={() => handleOperator('-')} className={getButtonClass('operator')}>−</button>

            <button onClick={() => handleNumber('1')} className={getButtonClass('number')}>1</button>
            <button onClick={() => handleNumber('2')} className={getButtonClass('number')}>2</button>
            <button onClick={() => handleNumber('3')} className={getButtonClass('number')}>3</button>
            <button onClick={() => handleOperator('+')} className={getButtonClass('operator')}>+</button>

            <button onClick={handleSquareRoot} className={getButtonClass('special')}>√</button>
            <button onClick={() => handleNumber('0')} className={getButtonClass('number')}>0</button>
            <button onClick={handleDecimal} className={getButtonClass('number')}>.</button>
            <button onClick={handleEqual} className={getButtonClass('equal')}>=</button>
            
            <button onClick={handlePower} className={`${getButtonClass('special')} col-span-4`}>x^y</button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-gray-300 text-sm max-w-md">
        <p>Tekan tombol Ganti Tema untuk mengubah tampilan kalkulator.</p>
        <p>Keyboard shortcut: angka, operator, Enter=sama dengan, Escape=clear, Backspace=hapus.</p>
      </div>
    </div>
  );
};

export default Calculator;