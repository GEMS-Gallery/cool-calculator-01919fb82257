import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { backend } from 'declarations/backend';

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: '48px',
  minHeight: '48px',
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    setFirstOperand(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const handleEquals = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        setDisplay(result.toString());
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
      setFirstOperand(null);
      setOperation(null);
    }
  };

  return (
    <div className="calculator">
      <div className="display">
        {display}
        {loading && <CircularProgress size={20} style={{ marginLeft: '10px' }} />}
      </div>
      <div className="keypad">
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map((num) => (
          <StyledButton key={num} variant="outlined" onClick={() => handleNumberClick(num)}>
            {num}
          </StyledButton>
        ))}
        <StyledButton variant="contained" color="primary" onClick={() => handleOperationClick('+')}>+</StyledButton>
        <StyledButton variant="contained" color="primary" onClick={() => handleOperationClick('-')}>-</StyledButton>
        <StyledButton variant="contained" color="primary" onClick={() => handleOperationClick('*')}>*</StyledButton>
        <StyledButton variant="contained" color="primary" onClick={() => handleOperationClick('/')}>/</StyledButton>
        <StyledButton variant="contained" color="secondary" onClick={handleClear}>C</StyledButton>
        <StyledButton variant="contained" color="error" onClick={handleEquals}>=</StyledButton>
      </div>
    </div>
  );
};

export default App;