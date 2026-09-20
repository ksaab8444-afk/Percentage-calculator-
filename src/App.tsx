import {useState, type CSSProperties} from 'react';

type ModeKey = 'mode1' | 'mode2' | 'mode3' | 'mode4' | 'mode5';

type ResultState = {
  value: string;
  detail: string;
  error?: string;
};

const formatNumber = (num: number, maxDecimals = 4) => {
  if (!Number.isFinite(num)) return '';
  const rounded = Number(Math.round(Number(num + 'e' + maxDecimals)) + 'e-' + maxDecimals);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  }).format(rounded);
};

const parseInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
};

const defaultResults: Record<ModeKey, ResultState> = {
  mode1: {value: '30', detail: '20% of 150 is equal to 30.'},
  mode2: {value: '20%', detail: '30 is 20% of 150.'},
  mode3: {value: '+50%', detail: 'Value increased by 50% (an absolute gain of +50).' },
  mode4: {value: '33.33%', detail: 'Value decreased by 33.33% (a reduction of -50).' },
  mode5: {value: '18.18%', detail: 'The relative percentage difference between 100 and 120 is 18.18%.'},
};

export default function App() {
  const [activeMode, setActiveMode] = useState<ModeKey>('mode1');
  const [mode1, setMode1] = useState({x: '20', y: '150'});
  const [mode2, setMode2] = useState({x: '30', y: '150'});
  const [mode3, setMode3] = useState({orig: '100', newValue: '150'});
  const [mode4, setMode4] = useState({orig: '150', newValue: '100'});
  const [mode5, setMode5] = useState({a: '100', b: '120'});
  const [results, setResults] = useState<Record<ModeKey, ResultState>>(defaultResults);

  const updateResult = (mode: ModeKey, result: ResultState) => {
    setResults((previous) => ({...previous, [mode]: result}));
  };

  const calculateMode1 = () => {
    const x = parseInput(mode1.x);
    const y = parseInput(mode1.y);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      updateResult('mode1', {value: '—', detail: 'Please enter valid numbers for both fields.', error: 'Please enter valid numbers for both fields.'});
      return;
    }
    const result = (x / 100) * y;
    updateResult('mode1', {
      value: formatNumber(result),
      detail: `(${formatNumber(x)} ÷ 100) × ${formatNumber(y)} = ${formatNumber(x / 100, 6)} × ${formatNumber(y)} = ${formatNumber(result)}`,
    });
  };

  const calculateMode2 = () => {
    const x = parseInput(mode2.x);
    const y = parseInput(mode2.y);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      updateResult('mode2', {value: '—', detail: 'Please enter valid numbers for both fields.', error: 'Please enter valid numbers for both fields.'});
      return;
    }
    if (y === 0) {
      updateResult('mode2', {value: '—', detail: 'The base number cannot be 0.', error: 'The base number cannot be 0.'});
      return;
    }
    const result = (x / y) * 100;
    updateResult('mode2', {
      value: `${formatNumber(result)}%`,
      detail: `(${formatNumber(x)} ÷ ${formatNumber(y)}) × 100 = ${formatNumber(x / y, 6)} × 100 = ${formatNumber(result)}%`,
    });
  };

  const calculateMode3 = () => {
    const original = parseInput(mode3.orig);
    const next = parseInput(mode3.newValue);
    if (Number.isNaN(original) || Number.isNaN(next)) {
      updateResult('mode3', {value: '—', detail: 'Please enter valid numbers for both fields.', error: 'Please enter valid numbers for both fields.'});
      return;
    }
    if (original === 0) {
      updateResult('mode3', {value: '—', detail: 'The original value cannot be 0.', error: 'The original value cannot be 0.'});
      return;
    }
    const difference = next - original;
    const percent = (difference / original) * 100;
    const amount = formatNumber(Math.abs(percent));
    const value = difference > 0 ? `+${amount}%` : difference < 0 ? `-${amount}%` : '0%';
    updateResult('mode3', {value, detail: `Percentage change: ${value}`});
  };

  const calculateMode4 = () => {
    const original = parseInput(mode4.orig);
    const next = parseInput(mode4.newValue);
    if (Number.isNaN(original) || Number.isNaN(next)) {
      updateResult('mode4', {value: '—', detail: 'Please enter valid numbers for both fields.', error: 'Please enter valid numbers for both fields.'});
      return;
    }
    if (original === 0) {
      updateResult('mode4', {value: '—', detail: 'The original value cannot be 0.', error: 'The original value cannot be 0.'});
      return;
    }
    const percent = ((original - next) / original) * 100;
    updateResult('mode4', {value: `${formatNumber(Math.abs(percent))}%`, detail: `Percentage change: ${formatNumber(percent)}%`});
  };

  const calculateMode5 = () => {
    const a = parseInput(mode5.a);
    const b = parseInput(mode5.b);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      updateResult('mode5', {value: '—', detail: 'Please enter valid numbers for both fields.', error: 'Please enter valid numbers for both fields.'});
      return;
    }
    const average = (a + b) / 2;
    if (average === 0) {
      updateResult('mode5', {value: '—', detail: 'The average cannot be 0.', error: 'The average cannot be 0.'});
      return;
    }
    const percent = (Math.abs(a - b) / Math.abs(average)) * 100;
    updateResult('mode5', {value: `${formatNumber(percent)}%`, detail: `Percentage difference: ${formatNumber(percent)}%`});
  };

  const calculate = {mode1: calculateMode1, mode2: calculateMode2, mode3: calculateMode3, mode4: calculateMode4, mode5: calculateMode5};
  const modes: Array<{key: ModeKey; label: string}> = [
    {key: 'mode1', label: 'What is X% of Y?'},
    {key: 'mode2', label: 'X is what % of Y?'},
    {key: 'mode3', label: '% Increase'},
    {key: 'mode4', label: '% Decrease'},
    {key: 'mode5', label: '% Difference'},
  ];

  const renderInputs = () => {
    if (activeMode === 'mode1') return <InputPair firstLabel="Percentage (X)" first={mode1.x} secondLabel="Total / Base Number (Y)" second={mode1.y} onChange={(first, second) => setMode1({x: first, y: second})} />;
    if (activeMode === 'mode2') return <InputPair firstLabel="Part / Value (X)" first={mode2.x} secondLabel="Whole / Base Number (Y)" second={mode2.y} onChange={(first, second) => setMode2({x: first, y: second})} />;
    if (activeMode === 'mode3') return <InputPair firstLabel="Original / Initial Value" first={mode3.orig} secondLabel="New / Final Value" second={mode3.newValue} onChange={(first, second) => setMode3({orig: first, newValue: second})} />;
    if (activeMode === 'mode4') return <InputPair firstLabel="Original / Initial Value" first={mode4.orig} secondLabel="New / Final Value" second={mode4.newValue} onChange={(first, second) => setMode4({orig: first, newValue: second})} />;
    return <InputPair firstLabel="Value A" first={mode5.a} secondLabel="Value B" second={mode5.b} onChange={(first, second) => setMode5({a: first, b: second})} />;
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <nav style={styles.tabs} aria-label="Percentage calculator modes">
          {modes.map((mode) => <button key={mode.key} type="button" onClick={() => setActiveMode(mode.key)} style={{...styles.tab, ...(activeMode === mode.key ? styles.activeTab : {})}}>{mode.label}</button>)}
        </nav>
        <form onSubmit={(event) => {event.preventDefault(); calculate[activeMode]();}}>
          {renderInputs()}
          <div style={styles.actions}>
            <button type="submit" style={styles.primary}>Calculate Result</button>
            <button type="button" style={styles.secondary} onClick={() => setResults((previous) => ({...previous, [activeMode]: {value: '—', detail: 'Enter values and calculate a result.'}}))}>Reset Result</button>
          </div>
        </form>
        <div style={styles.result} aria-live="polite">
          <div style={styles.resultLabel}>Calculated Answer</div>
          <div style={styles.resultValue}>{results[activeMode].value}</div>
          <div style={styles.resultDetail}>{results[activeMode].detail}</div>
        </div>
      </section>
    </main>
  );
}

function InputPair({firstLabel, first, secondLabel, second, onChange}: {firstLabel: string; first: string; secondLabel: string; second: string; onChange: (first: string, second: string) => void}) {
  return <div style={styles.row}>
    <label style={styles.field}><span>{firstLabel}</span><input value={first} onChange={(event) => onChange(event.target.value, second)} style={styles.input} inputMode="decimal" /></label>
    <label style={styles.field}><span>{secondLabel}</span><input value={second} onChange={(event) => onChange(first, event.target.value)} style={styles.input} inputMode="decimal" /></label>
  </div>;
}

const styles: Record<string, CSSProperties> = {
  page: {minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f3f4f6', padding: '2rem', fontFamily: 'Arial, sans-serif'},
  card: {width: '100%', maxWidth: '960px', background: '#fff', borderRadius: '18px', boxShadow: '0 16px 40px rgba(0,0,0,.08)', padding: '1.5rem'},
  tabs: {display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginBottom: '1.5rem'},
  tab: {border: '1px solid #d1d5db', background: '#f9fafb', borderRadius: '10px', padding: '.75rem 1rem', cursor: 'pointer', fontWeight: 600},
  activeTab: {background: '#2563eb', borderColor: '#2563eb', color: '#fff'},
  row: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem'},
  field: {display: 'flex', flexDirection: 'column', gap: '.5rem', fontWeight: 600, color: '#1f2937'},
  input: {width: '100%', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '10px', padding: '.75rem .9rem', fontSize: '1rem'},
  actions: {marginTop: '1.5rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap'},
  primary: {border: 0, background: '#2563eb', color: '#fff', borderRadius: '10px', padding: '.8rem 1.2rem', cursor: 'pointer', fontWeight: 700},
  secondary: {border: '1px solid #d1d5db', background: '#fff', borderRadius: '10px', padding: '.8rem 1.2rem', cursor: 'pointer', fontWeight: 700},
  result: {marginTop: '2rem', border: '1px solid #dbeafe', background: '#eff6ff', borderRadius: '14px', padding: '1rem 1.25rem'},
  resultLabel: {fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.08em', color: '#1d4ed8', fontWeight: 700},
  resultValue: {marginTop: '.5rem', fontSize: '2rem', fontWeight: 800, color: '#111827'},
  resultDetail: {marginTop: '.4rem', color: '#374151', lineHeight: 1.5},
};
