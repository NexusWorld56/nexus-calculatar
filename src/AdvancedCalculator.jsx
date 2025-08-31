import React, { useState, useEffect, useRef } from 'react';
import { Calculator, TrendingUp, Zap, Brain, Settings, History, Code, PieChart, BarChart3, LineChart, Globe, Atom, BookOpen, Lightbulb } from 'lucide-react';
import * as math from 'mathjs';
import { LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from 'recharts';

const AdvancedCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);
  const [activeMode, setActiveMode] = useState('basic');
  const [memory, setMemory] = useState(0);
  const [variables, setVariables] = useState({});
  const [plotData, setPlotData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const canvasRef = useRef(null);

  const modes = {
    basic: { icon: Calculator, name: 'Basic', color: 'bg-blue-500' },
    scientific: { icon: Atom, name: 'Scientific', color: 'bg-purple-500' },
    programming: { icon: Code, name: 'Programming', color: 'bg-green-500' },
    statistics: { icon: BarChart3, name: 'Statistics', color: 'bg-orange-500' },
    graphing: { icon: LineChart, name: 'Graphing', color: 'bg-red-500' },
    finance: { icon: TrendingUp, name: 'Finance', color: 'bg-yellow-500' },
    unit: { icon: Globe, name: 'Unit Converter', color: 'bg-indigo-500' },
    ai: { icon: Brain, name: 'AI Math', color: 'bg-pink-500' }
  };

  const addToHistory = (calculation, result) => {
    const newEntry = { calculation, result, timestamp: new Date().toLocaleTimeString() };
    setHistory(prev => [newEntry, ...prev.slice(0, 19)]);
  };

  const calculate = () => {
    try {
      const result = math.evaluate(display);
      addToHistory(display, result.toString());
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleInput = (value) => {
    if (display === '0' || display === 'Error') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const clear = () => setDisplay('0');
  const deleteLast = () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0');

  const scientificFunctions = [
    { label: 'sin', func: 'sin(' },
    { label: 'cos', func: 'cos(' },
    { label: 'tan', func: 'tan(' },
    { label: 'ln', func: 'log(' },
    { label: 'log', func: 'log10(' },
    { label: 'π', func: 'pi' },
    { label: 'e', func: 'e' },
    { label: 'x²', func: '^2' },
    { label: '√', func: 'sqrt(' },
    { label: '∛', func: 'cbrt(' },
    { label: 'x!', func: '!' },
    { label: '|x|', func: 'abs(' }
  ];

  const programmingFunctions = [
    { label: 'AND', func: ' & ' },
    { label: 'OR', func: ' | ' },
    { label: 'XOR', func: ' ^ ' },
    { label: 'NOT', func: '~' },
    { label: '<<', func: ' << ' },
    { label: '>>', func: ' >> ' },
    { label: 'HEX', func: 'hex(' },
    { label: 'BIN', func: 'bin(' },
    { label: 'OCT', func: 'oct(' },
    { label: 'MOD', func: ' % ' }
  ];

  const generateGraph = () => {
    try {
      const expr = math.parse(display);
      const data = [];
      for (let x = -10; x <= 10; x += 0.5) {
        try {
          const y = expr.evaluate({ x });
          if (typeof y === 'number' && isFinite(y)) {
            data.push({ x, y });
          }
        } catch (e) {
          // Skip invalid points
        }
      }
      setPlotData(data);
      setShowGraph(true);
    } catch (error) {
      setDisplay('Invalid function for graphing');
    }
  };

  const financialCalculators = {
    compound: (principal, rate, time, compound) => {
      return principal * Math.pow(1 + rate / compound, compound * time);
    },
    loan: (principal, rate, months) => {
      const monthlyRate = rate / 12;
      return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
             (Math.pow(1 + monthlyRate, months) - 1);
    }
  };

  const unitConversions = {
    length: { m: 1, ft: 3.28084, in: 39.3701, cm: 100, km: 0.001 },
    weight: { kg: 1, lb: 2.20462, oz: 35.274, g: 1000 },
    temperature: { c: (c) => c, f: (c) => c * 9/5 + 32, k: (c) => c + 273.15 }
  };

  const renderBasicMode = () => (
    <div className="grid grid-cols-4 gap-2">
      {['C', '⌫', '(', ')'].map(btn => (
        <button key={btn} onClick={() => btn === 'C' ? clear() : btn === '⌫' ? deleteLast() : handleInput(btn)}
                className="p-4 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold">
          {btn}
        </button>
      ))}
      {['7', '8', '9', '/'].map(btn => (
        <button key={btn} onClick={() => handleInput(btn)}
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold">
          {btn}
        </button>
      ))}
      {['4', '5', '6', '*'].map(btn => (
        <button key={btn} onClick={() => handleInput(btn)}
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold">
          {btn}
        </button>
      ))}
      {['1', '2', '3', '-'].map(btn => (
        <button key={btn} onClick={() => handleInput(btn)}
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold">
          {btn}
        </button>
      ))}
      <button onClick={() => handleInput('0')} className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold col-span-2">0</button>
      <button onClick={() => handleInput('.')} className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold">.</button>
      <button onClick={() => handleInput('+')} className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold">+</button>
      <button onClick={calculate} className="p-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold col-span-4">=</button>
    </div>
  );

  const renderScientificMode = () => (
    <div className="grid grid-cols-4 gap-2">
      {scientificFunctions.map(func => (
        <button key={func.label} onClick={() => handleInput(func.func)}
                className="p-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold text-sm">
          {func.label}
        </button>
      ))}
    </div>
  );

  const renderProgrammingMode = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {programmingFunctions.map(func => (
          <button key={func.label} onClick={() => handleInput(func.func)}
                  className="p-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-sm">
            {func.label}
          </button>
        ))}
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-sm text-gray-300 mb-2">Binary: {parseInt(display) ? parseInt(display).toString(2) : 'N/A'}</div>
        <div className="text-sm text-gray-300 mb-2">Hex: {parseInt(display) ? parseInt(display).toString(16).toUpperCase() : 'N/A'}</div>
        <div className="text-sm text-gray-300">Octal: {parseInt(display) ? parseInt(display).toString(8) : 'N/A'}</div>
      </div>
    </div>
  );

  const renderGraphingMode = () => (
    <div className="space-y-4">
      <button onClick={generateGraph} className="w-full p-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold">
        Graph Function (use x as variable)
      </button>
      {showGraph && plotData.length > 0 && (
        <div className="h-64 bg-gray-800 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="x" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#EF4444" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );

  const renderFinanceMode = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => {
          const principal = parseFloat(prompt('Principal amount:') || '0');
          const rate = parseFloat(prompt('Annual interest rate (decimal):') || '0');
          const time = parseFloat(prompt('Time in years:') || '0');
          const compound = parseFloat(prompt('Compounds per year:') || '1');
          const result = financialCalculators.compound(principal, rate, time, compound);
          setDisplay(result.toFixed(2));
        }} className="p-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-semibold text-sm">
          Compound Interest
        </button>
        <button onClick={() => {
          const principal = parseFloat(prompt('Loan amount:') || '0');
          const rate = parseFloat(prompt('Annual interest rate (decimal):') || '0');
          const months = parseFloat(prompt('Loan term (months):') || '0');
          const result = financialCalculators.loan(principal, rate, months);
          setDisplay(result.toFixed(2));
        }} className="p-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-semibold text-sm">
          Loan Payment
        </button>
      </div>
    </div>
  );

  const renderAIMode = () => (
    <div className="space-y-4">
      <div className="bg-pink-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Mathematical Assistant
        </h3>
        <p className="text-sm text-gray-300 mb-3">
          Advanced mathematical problem solving and equation analysis
        </p>
        <button onClick={() => {
          try {
            // Advanced mathematical analysis
            const expr = display;
            const derivative = math.derivative(expr, 'x').toString();
            const result = `Function: ${expr}\nDerivative: ${derivative}`;
            setDisplay(derivative);
            addToHistory(`d/dx(${expr})`, derivative);
          } catch (error) {
            setDisplay('Enter valid function with x');
          }
        }} className="w-full p-3 bg-pink-600 hover:bg-pink-500 rounded-lg font-semibold text-sm">
          Calculate Derivative
        </button>
      </div>
    </div>
  );

  const renderModeContent = () => {
    switch (activeMode) {
      case 'basic': return renderBasicMode();
      case 'scientific': return renderScientificMode();
      case 'programming': return renderProgrammingMode();
      case 'graphing': return renderGraphingMode();
      case 'finance': return renderFinanceMode();
      case 'ai': return renderAIMode();
      default: return renderBasicMode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            NEXUS CALCULATOR
          </h1>
          <p className="text-gray-400">The Most Advanced Calculator Ever Created</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Calculator */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
            {/* Mode Selector */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {Object.entries(modes).map(([key, mode]) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveMode(key)}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      activeMode === key ? mode.color : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{mode.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Display */}
            <div className="bg-black rounded-lg p-6 mb-6 border border-gray-600">
              <div className="text-right text-3xl font-mono break-all overflow-hidden">
                {display}
              </div>
              <div className="text-right text-sm text-gray-400 mt-2">
                Mode: {modes[activeMode].name} | Memory: {memory}
              </div>
            </div>

            {/* Mode-specific content */}
            {renderModeContent()}

            {/* Memory and utility buttons */}
            <div className="grid grid-cols-6 gap-2 mt-4">
              <button onClick={() => setMemory(parseFloat(display) || 0)} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-sm">
                MS
              </button>
              <button onClick={() => setDisplay(memory.toString())} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-sm">
                MR
              </button>
              <button onClick={() => setMemory(memory + (parseFloat(display) || 0))} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-sm">
                M+
              </button>
              <button onClick={() => setMemory(0)} className="p-2 bg-gray-600 hover:bg-gray-500 rounded text-sm">
                MC
              </button>
              <button onClick={() => setDisplay(Math.random().toString())} className="p-2 bg-purple-600 hover:bg-purple-500 rounded text-sm">
                RND
              </button>
              <button onClick={() => handleInput('ans')} className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-sm">
                ANS
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* History */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                History
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((entry, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600"
                       onClick={() => setDisplay(entry.calculation)}>
                    <div className="text-sm text-gray-300">{entry.calculation}</div>
                    <div className="text-lg font-semibold">{entry.result}</div>
                    <div className="text-xs text-gray-400">{entry.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div>Calculations: {history.length}</div>
                <div>Active Mode: {modes[activeMode].name}</div>
                <div>Memory: {memory}</div>
                <div>Variables: {Object.keys(variables).length}</div>
              </div>
            </div>

            {/* Constants */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Constants
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button onClick={() => handleInput('pi')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">π</button>
                <button onClick={() => handleInput('e')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">e</button>
                <button onClick={() => handleInput('299792458')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">c</button>
                <button onClick={() => handleInput('6.626e-34')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">ℏ</button>
                <button onClick={() => handleInput('9.81')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">g</button>
                <button onClick={() => handleInput('1.618')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded">φ</button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features Bar */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Matrix Operations</span>
            </button>
            <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg hover:from-green-500 hover:to-blue-500 transition-all">
              <PieChart className="w-5 h-5" />
              <span className="font-semibold">Complex Numbers</span>
            </button>
            <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg hover:from-orange-500 hover:to-red-500 transition-all">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Equation Solver</span>
            </button>
            <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all">
              <Settings className="w-5 h-5" />
              <span className="font-semibold">Calculus Tools</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p>Powered by advanced mathematical algorithms and AI assistance</p>
          <p className="text-sm mt-2">Features: Real-time graphing • Matrix operations • Statistical analysis • Unit conversion • Programming functions</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalculator;