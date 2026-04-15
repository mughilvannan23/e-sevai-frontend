import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ otp, setOtp, onComplete }) => {
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Update inputs when otp prop changes (for clearing/resetting)
  useEffect(() => {
    if (!otp) {
      setInputs(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }, [otp]);

  const handleChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    // Update inputs array
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Combine all inputs into single OTP string
    const finalOtp = newInputs.join('');
    setOtp(finalOtp);

    // Call onComplete when OTP is complete
    if (finalOtp.length === 6) {
      onComplete(finalOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length > 0) {
      const newInputs = pastedData.split('');
      // Fill remaining inputs with empty strings
      while (newInputs.length < 6) {
        newInputs.push('');
      }
      setInputs(newInputs);
      
      const finalOtp = newInputs.join('');
      setOtp(finalOtp);
      
      if (finalOtp.length === 6) {
        onComplete(finalOtp);
      }
      
      // Focus the last filled input
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.otpHeader}>
        <h4 style={styles.otpTitle}>Enter OTP</h4>
        <p style={styles.otpSubtitle}>Please check your email for the 6-digit code</p>
      </div>
      
      <div style={styles.inputContainer}>
        {inputs.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            style={styles.otpInput}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    marginBottom: '24px',
    textAlign: 'center'
  },
  otpHeader: {
    marginBottom: '16px'
  },
  otpTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  otpSubtitle: {
    margin: 0,
    fontSize: '12px',
    color: '#666',
    lineHeight: '1.4'
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 0'
  },
  otpInput: {
    width: '48px',
    height: '48px',
    fontSize: '20px',
    fontWeight: '600',
    textAlign: 'center',
    border: '2px solid #ddd',
    borderRadius: '12px',
    outline: 'none',
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
    fontFamily: 'monospace'
  }
};

export default OTPInput;