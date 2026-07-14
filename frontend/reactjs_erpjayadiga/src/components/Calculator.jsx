import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const calculate = () => {
    try {
      // Use eval safely for simple calculator string
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + equation + display)();
      const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(2);
      setDisplay(formatted.toString());
      setEquation('');
      setIsNewNumber(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  return (
    <div className="fixed right-8 top-1/4 z-[70] bg-white rounded-2xl shadow-2xl border border-gray-200 w-72 overflow-hidden flex flex-col animate-in slide-in-from-right-8">
      <div className="bg-[#1A3263] p-4 flex justify-between items-center text-white">
        <div className="font-bold flex items-center gap-2">
          Kalkulator
        </div>
        <button onClick={onClose} className="text-blue-200 hover:text-white transition">
          <X size={20} />
        </button>
      </div>

      <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-col items-end gap-1">
        <div className="text-sm text-gray-500 min-h-[20px] font-mono">{equation}</div>
        <input 
          type="text"
          value={display}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, '');
            setDisplay(val === '' ? '0' : val);
            setIsNewNumber(false);
          }}
          className="text-3xl font-bold text-gray-800 font-mono tracking-wider text-right w-full bg-transparent outline-none"
        />
      </div>

      <div className="p-4 grid grid-cols-4 gap-3 bg-white">
        <button onClick={handleClear} className="col-span-2 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition active:scale-95">AC</button>
        <button onClick={handleDelete} className="py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition active:scale-95 flex items-center justify-center"><Delete size={18} /></button>
        <button onClick={() => handleOperator('/')} className="py-3 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition active:scale-95">÷</button>

        <button onClick={() => handleNumber('7')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">7</button>
        <button onClick={() => handleNumber('8')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">8</button>
        <button onClick={() => handleNumber('9')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">9</button>
        <button onClick={() => handleOperator('*')} className="py-3 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition active:scale-95">×</button>

        <button onClick={() => handleNumber('4')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">4</button>
        <button onClick={() => handleNumber('5')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">5</button>
        <button onClick={() => handleNumber('6')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">6</button>
        <button onClick={() => handleOperator('-')} className="py-3 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition active:scale-95">-</button>

        <button onClick={() => handleNumber('1')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">1</button>
        <button onClick={() => handleNumber('2')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">2</button>
        <button onClick={() => handleNumber('3')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">3</button>
        <button onClick={() => handleOperator('+')} className="py-3 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition active:scale-95">+</button>

        <button onClick={() => handleNumber('0')} className="col-span-2 py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">0</button>
        <button onClick={() => handleNumber('.')} className="py-3 bg-gray-50 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition active:scale-95">.</button>
        <button onClick={calculate} className="py-3 bg-[#1A3263] text-white font-bold rounded-lg hover:bg-[#122345] transition shadow-md active:scale-95">=</button>
      </div>
    </div>
  );
};

export default Calculator;
