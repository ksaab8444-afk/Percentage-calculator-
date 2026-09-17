/**
 * Percentage Calculator - Pure Vanilla JavaScript Module
 * Handles all 5 calculation modes, validation, formatting, accessibility, and UI states.
 */

(function () {
  'use strict';

  // --- Utility: Format Numbers cleanly ---
  function formatNumber(num, maxDecimals = 4) {
    if (!Number.isFinite(num)) return '';
    // Avoid floating point inaccuracies like 0.30000000000000004
    const rounded = Number(Math.round(Number(num + 'e' + maxDecimals)) + 'e-' + maxDecimals);
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: maxDecimals,
      minimumFractionDigits: 0
    }).format(rounded);
  }

  // --- Utility: Parse Input Value ---
  function parseInput(val) {
    if (val === null || val === undefined) return NaN;
    const trimmed = String(val).trim();
    if (trimmed === '') return NaN;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : NaN;
  }

  // --- Utility: Show / Hide Errors ---
  function showError(panelId, message) {
    const errorBox = document.getElementById(`${panelId}-error`);
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.add('active');
    }
  }

  function hideError(panelId) {
    const errorBox = document.getElementById(`${panelId}-error`);
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.classList.remove('active');
    }
  }

  // --- Utility: Show / Hide Results ---
  function hideResult(panelId) {
    const resultBox = document.getElementById(`${panelId}-result`);
    if (resultBox) {
      resultBox.classList.remove('active');
    }
  }

  // --- Mode 1: What is X% of Y? ---
  function calculateMode1() {
    const panelId = 'mode1';
    hideError(panelId);

    const xInput = document.getElementById('mode1-x');
    const yInput = document.getElementById('mode1-y');

    const x = parseInput(xInput.value);
    const y = parseInput(yInput.value);

    let hasError = false;
    xInput.classList.remove('invalid');
    yInput.classList.remove('invalid');

    if (Number.isNaN(x)) {
      xInput.classList.add('invalid');
      hasError = true;
    }
    if (Number.isNaN(y)) {
      yInput.classList.add('invalid');
      hasError = true;
    }

    if (hasError) {
      showError(panelId, 'Please enter valid numbers for both the percentage (X) and the total (Y).');
      hideResult(panelId);
      return;
    }

    // Formula: (X / 100) * Y
    const decimalValue = x / 100;
    const result = decimalValue * y;

    const formattedResult = formatNumber(result);
    const formattedX = formatNumber(x);
    const formattedY = formatNumber(y);
    const formattedDec = formatNumber(decimalValue, 6);

    const resultValEl = document.getElementById('mode1-result-val');
    const stepEl = document.getElementById('mode1-step-formula');
    const noteEl = document.getElementById('mode1-step-note');
    const resultBox = document.getElementById('mode1-result');

    resultValEl.textContent = formattedResult;
    stepEl.textContent = `(${formattedX} ÷ 100) × ${formattedY} = ${formattedDec} × ${formattedY} = ${formattedResult}`;
    noteEl.textContent = `${formattedX}% of ${formattedY} is equal to ${formattedResult}.`;

    resultBox.dataset.copyValue = formattedResult;
    resultBox.classList.add('active');
  }

  // --- Mode 2: X is what percent of Y? ---
  function calculateMode2() {
    const panelId = 'mode2';
    hideError(panelId);

    const xInput = document.getElementById('mode2-x');
    const yInput = document.getElementById('mode2-y');

    const x = parseInput(xInput.value);
    const y = parseInput(yInput.value);

    let hasError = false;
    xInput.classList.remove('invalid');
    yInput.classList.remove('invalid');

    if (Number.isNaN(x)) {
      xInput.classList.add('invalid');
      hasError = true;
    }
    if (Number.isNaN(y)) {
      yInput.classList.add('invalid');
      hasError = true;
    }

    if (hasError) {
      showError(panelId, 'Please enter valid numbers for both the part (X) and whole (Y).');
      hideResult(panelId);
      return;
    }

    if (y === 0) {
      yInput.classList.add('invalid');
      showError(panelId, 'The base number (Y) cannot be 0 because division by zero is undefined.');
      hideResult(panelId);
      return;
    }

    // Formula: (X / Y) * 100
    const ratio = x / y;
    const result = ratio * 100;

    const formattedResult = formatNumber(result);
    const formattedX = formatNumber(x);
    const formattedY = formatNumber(y);
    const formattedRatio = formatNumber(ratio, 6);

    const resultValEl = document.getElementById('mode2-result-val');
    const stepEl = document.getElementById('mode2-step-formula');
    const noteEl = document.getElementById('mode2-step-note');
    const resultBox = document.getElementById('mode2-result');

    resultValEl.textContent = `${formattedResult}%`;
    stepEl.textContent = `(${formattedX} ÷ ${formattedY}) × 100 = ${formattedRatio} × 100 = ${formattedResult}%`;
    noteEl.textContent = `${formattedX} is ${formattedResult}% of ${formattedY}.`;

    resultBox.dataset.copyValue = `${formattedResult}%`;
    resultBox.classList.add('active');
  }

  // --- Mode 3: Percentage Increase ---
  function calculateMode3() {
    const panelId = 'mode3';
    hideError(panelId);

    const origInput = document.getElementById('mode3-orig');
    const newInput = document.getElementById('mode3-new');

    const orig = parseInput(origInput.value);
    const newVal = parseInput(newInput.value);

    let hasError = false;
    origInput.classList.remove('invalid');
    newInput.classList.remove('invalid');

    if (Number.isNaN(orig)) {
      origInput.classList.add('invalid');
      hasError = true;
    }
    if (Number.isNaN(newVal)) {
      newInput.classList.add('invalid');
      hasError = true;
    }

    if (hasError) {
      showError(panelId, 'Please enter valid numbers for both the original value and the new value.');
      hideResult(panelId);
      return;
    }

    if (orig === 0) {
      origInput.classList.add('invalid');
      showError(panelId, 'The original value cannot be 0 because calculating percentage change from zero is undefined.');
      hideResult(panelId);
      return;
    }

    // Formula: ((New - Original) / Original) * 100
    const diff = newVal - orig;
    const ratio = diff / orig;
    const percentChange = ratio * 100;

    const formattedPercent = formatNumber(Math.abs(percentChange));
    const formattedDiff = formatNumber(diff);
    const formattedOrig = formatNumber(orig);
    const formattedNew = formatNumber(newVal);

    const resultValEl = document.getElementById('mode3-result-val');
    const badgeEl = document.getElementById('mode3-result-badge');
    const stepEl = document.getElementById('mode3-step-formula');
    const noteEl = document.getElementById('mode3-step-note');
    const resultBox = document.getElementById('mode3-result');

    if (diff > 0) {
      resultValEl.textContent = `+${formattedPercent}%`;
      badgeEl.textContent = 'Increase';
      badgeEl.className = 'result-badge badge-increase';
      noteEl.textContent = `Value increased by ${formattedPercent}% (an absolute gain of +${formattedDiff}).`;
    } else if (diff < 0) {
      resultValEl.textContent = `-${formattedPercent}%`;
      badgeEl.textContent = 'Decrease';
      badgeEl.className = 'result-badge badge-decrease';
      noteEl.textContent = `Value decreased by ${formattedPercent}% (an absolute drop of ${formattedDiff}).`;
    } else {
      resultValEl.textContent = '0%';
      badgeEl.textContent = 'No Change';
      badgeEl.className = 'result-badge badge-neutral';
      noteEl.textContent = 'There is no change between original and new values.';
    }

    stepEl.textContent = `((${formattedNew} - ${formattedOrig}) ÷ ${formattedOrig}) × 100 = (${formattedDiff} ÷ ${formattedOrig}) × 100 = ${diff >= 0 ? '+' : ''}${formatNumber(percentChange)}%`;

    resultBox.dataset.copyValue = `${diff >= 0 ? '+' : '-'}${formattedPercent}%`;
    resultBox.classList.add('active');
  }

  // --- Mode 4: Percentage Decrease ---
  function calculateMode4() {
    const panelId = 'mode4';
    hideError(panelId);

    const origInput = document.getElementById('mode4-orig');
    const newInput = document.getElementById('mode4-new');

    const orig = parseInput(origInput.value);
    const newVal = parseInput(newInput.value);

    let hasError = false;
    origInput.classList.remove('invalid');
    newInput.classList.remove('invalid');

    if (Number.isNaN(orig)) {
      origInput.classList.add('invalid');
      hasError = true;
    }
    if (Number.isNaN(newVal)) {
      newInput.classList.add('invalid');
      hasError = true;
    }

    if (hasError) {
      showError(panelId, 'Please enter valid numbers for both the original value and the new value.');
      hideResult(panelId);
      return;
    }

    if (orig === 0) {
      origInput.classList.add('invalid');
      showError(panelId, 'The original value cannot be 0 because calculating percentage decrease from zero is undefined.');
      hideResult(panelId);
      return;
    }

    // Formula: ((Original - New) / Original) * 100
    const drop = orig - newVal;
    const ratio = drop / orig;
    const percentDrop = ratio * 100;

    const formattedPercent = formatNumber(Math.abs(percentDrop));
    const formattedDrop = formatNumber(drop);
    const formattedOrig = formatNumber(orig);
    const formattedNew = formatNumber(newVal);

    const resultValEl = document.getElementById('mode4-result-val');
    const badgeEl = document.getElementById('mode4-result-badge');
    const stepEl = document.getElementById('mode4-step-formula');
    const noteEl = document.getElementById('mode4-step-note');
    const resultBox = document.getElementById('mode4-result');

    if (drop > 0) {
      resultValEl.textContent = `${formattedPercent}%`;
      badgeEl.textContent = 'Decrease';
      badgeEl.className = 'result-badge badge-decrease';
      noteEl.textContent = `Value decreased by ${formattedPercent}% (a reduction of -${formattedDrop}).`;
    } else if (drop < 0) {
      resultValEl.textContent = `-${formattedPercent}%`;
      badgeEl.textContent = 'Increase';
      badgeEl.className = 'result-badge badge-increase';
      noteEl.textContent = `The new value is higher; this represents an increase of ${formattedPercent}%.`;
    } else {
      resultValEl.textContent = '0%';
      badgeEl.textContent = 'No Change';
      badgeEl.className = 'result-badge badge-neutral';
      noteEl.textContent = 'There is no reduction between original and new values.';
    }

    stepEl.textContent = `((${formattedOrig} - ${formattedNew}) ÷ ${formattedOrig}) × 100 = (${formattedDrop} ÷ ${formattedOrig}) × 100 = ${formatNumber(percentDrop)}%`;

    resultBox.dataset.copyValue = `${formattedPercent}% decrease`;
    resultBox.classList.add('active');
  }

  // --- Mode 5: Percentage Difference ---
  function calculateMode5() {
    const panelId = 'mode5';
    hideError(panelId);

    const aInput = document.getElementById('mode5-a');
    const bInput = document.getElementById('mode5-b');

    const a = parseInput(aInput.value);
    const b = parseInput(bInput.value);

    let hasError = false;
    aInput.classList.remove('invalid');
    bInput.classList.remove('invalid');

    if (Number.isNaN(a)) {
      aInput.classList.add('invalid');
      hasError = true;
    }
    if (Number.isNaN(b)) {
      bInput.classList.add('invalid');
      hasError = true;
    }

    if (hasError) {
      showError(panelId, 'Please enter valid numbers for both Value A and Value B.');
      hideResult(panelId);
      return;
    }

    const average = (a + b) / 2;
    if (average === 0) {
      showError(panelId, 'The average of Value A and Value B is 0 (A + B = 0), which causes division by zero.');
      hideResult(panelId);
      return;
    }

    // Formula: (|A - B| / ((A + B) / 2)) * 100
    const absoluteDiff = Math.abs(a - b);
    const ratio = absoluteDiff / Math.abs(average);
    const percentDiff = ratio * 100;

    const formattedPercent = formatNumber(percentDiff);
    const formattedA = formatNumber(a);
    const formattedB = formatNumber(b);
    const formattedDiff = formatNumber(absoluteDiff);
    const formattedAvg = formatNumber(average);

    const resultValEl = document.getElementById('mode5-result-val');
    const stepEl = document.getElementById('mode5-step-formula');
    const noteEl = document.getElementById('mode5-step-note');
    const resultBox = document.getElementById('mode5-result');

    resultValEl.textContent = `${formattedPercent}%`;
    stepEl.textContent = `(|${formattedA} - ${formattedB}| ÷ ((${formattedA} + ${formattedB}) ÷ 2)) × 100 = (${formattedDiff} ÷ ${formattedAvg}) × 100 = ${formattedPercent}%`;
    noteEl.textContent = `The relative percentage difference between ${formattedA} and ${formattedB} is ${formattedPercent}%.`;

    resultBox.dataset.copyValue = `${formattedPercent}%`;
    resultBox.classList.add('active');
  }

  // --- Reset Panel Handlers ---
  function resetPanel(panelId) {
    hideError(panelId);
    hideResult(panelId);

    const panel = document.getElementById(panelId);
    if (!panel) return;

    const inputs = panel.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('invalid');
    });

    if (inputs.length > 0) {
      inputs[0].focus();
    }
  }

  // --- Mode Switching / Tabs ---
  function switchTab(targetModeId) {
    const tabs = document.querySelectorAll('.mode-tab');
    const panels = document.querySelectorAll('.calc-panel');

    tabs.forEach(tab => {
      const isTarget = tab.dataset.target === targetModeId;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    panels.forEach(panel => {
      const isTarget = panel.id === targetModeId;
      panel.classList.toggle('active', isTarget);
    });

    // Focus the first input of the activated panel
    const activePanel = document.getElementById(targetModeId);
    if (activePanel) {
      const firstInput = activePanel.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }
  }

  // --- Copy Result to Clipboard ---
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const resultContainer = this.closest('.result-container');
        if (!resultContainer) return;
        const textToCopy = resultContainer.dataset.copyValue || '';

        if (!textToCopy) return;

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyFeedback(btn);
          }).catch(() => {
            fallbackCopy(textToCopy, btn);
          });
        } else {
          fallbackCopy(textToCopy, btn);
        }
      });
    });
  }

  function showCopyFeedback(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✓ Copied!</span>';
    btn.style.color = '#059669';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.color = '';
    }, 1800);
  }

  function fallbackCopy(text, btn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showCopyFeedback(btn);
    } catch (err) {
      console.error('Failed to copy', err);
    }
    document.body.removeChild(textArea);
  }

  // --- Setup Event Listeners ---
  function init() {
    // 1. Tab buttons click
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        if (target) switchTab(target);
      });
    });

    // 2. Quick link buttons click
    document.querySelectorAll('.quick-link-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target) {
          switchTab(target);
          const card = document.getElementById('calc-app-card');
          if (card) card.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // 3. Calculator Calculate Buttons & Form Submit
    const calcHandlers = {
      'mode1': calculateMode1,
      'mode2': calculateMode2,
      'mode3': calculateMode3,
      'mode4': calculateMode4,
      'mode5': calculateMode5
    };

    Object.keys(calcHandlers).forEach(modeId => {
      const form = document.getElementById(`${modeId}-form`);
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          calcHandlers[modeId]();
        });
      }

      const resetBtn = document.getElementById(`${modeId}-reset-btn`);
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          resetPanel(modeId);
        });
      }

      // Live removal of invalid state on input
      const panel = document.getElementById(modeId);
      if (panel) {
        panel.querySelectorAll('input').forEach(input => {
          input.addEventListener('input', () => {
            input.classList.remove('invalid');
            hideError(modeId);
          });
        });
      }
    });

    // 4. "Try Example" header hint buttons
    document.querySelectorAll('.example-hint-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (mode === 'mode1') {
          document.getElementById('mode1-x').value = '20';
          document.getElementById('mode1-y').value = '150';
          calculateMode1();
        } else if (mode === 'mode2') {
          document.getElementById('mode2-x').value = '30';
          document.getElementById('mode2-y').value = '150';
          calculateMode2();
        } else if (mode === 'mode3') {
          document.getElementById('mode3-orig').value = '100';
          document.getElementById('mode3-new').value = '150';
          calculateMode3();
        } else if (mode === 'mode4') {
          document.getElementById('mode4-orig').value = '150';
          document.getElementById('mode4-new').value = '100';
          calculateMode4();
        } else if (mode === 'mode5') {
          document.getElementById('mode5-a').value = '100';
          document.getElementById('mode5-b').value = '120';
          calculateMode5();
        }
      });
    });

    // 5. Example Cards "Load into calculator" buttons
    document.querySelectorAll('.example-load-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        switchTab(mode);
        const card = document.getElementById('calc-app-card');
        if (card) card.scrollIntoView({ behavior: 'smooth' });

        if (mode === 'mode1') {
          document.getElementById('mode1-x').value = btn.dataset.val1;
          document.getElementById('mode1-y').value = btn.dataset.val2;
          calculateMode1();
        } else if (mode === 'mode2') {
          document.getElementById('mode2-x').value = btn.dataset.val1;
          document.getElementById('mode2-y').value = btn.dataset.val2;
          calculateMode2();
        } else if (mode === 'mode3') {
          document.getElementById('mode3-orig').value = btn.dataset.val1;
          document.getElementById('mode3-new').value = btn.dataset.val2;
          calculateMode3();
        } else if (mode === 'mode4') {
          document.getElementById('mode4-orig').value = btn.dataset.val1;
          document.getElementById('mode4-new').value = btn.dataset.val2;
          calculateMode4();
        } else if (mode === 'mode5') {
          document.getElementById('mode5-a').value = btn.dataset.val1;
          document.getElementById('mode5-b').value = btn.dataset.val2;
          calculateMode5();
        }
      });
    });

    // 6. Copy button init
    initCopyButtons();

    // 7. Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Run initial example for mode 1 so the user immediately sees working state
    document.getElementById('mode1-x').value = '20';
    document.getElementById('mode1-y').value = '150';
    calculateMode1();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
