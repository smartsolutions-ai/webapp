'use client';

import { useState, useEffect } from 'react';
import { firebaseSmsService } from '~/lib/utils/sms';

export default function TestMobileOtp() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const updateDebugInfo = async () => {
    const info: any = {};

    // Check reCAPTCHA service state
    try {
      info.recaptchaReady = await firebaseSmsService.isRecaptchaReady();
    } catch (error) {
      info.recaptchaReadyError = error;
    }

    // Check DOM elements
    const recaptchaContainer = document.getElementById('recaptcha-container');
    info.recaptchaContainerExists = !!recaptchaContainer;
    if (recaptchaContainer) {
      info.recaptchaContainerChildren = recaptchaContainer.children.length;
      info.recaptchaContainerHTML = recaptchaContainer.innerHTML;
    }

    setDebugInfo(info);
  };

  // Initialize debug info on mount
  useEffect(() => {
    updateDebugInfo();
  }, []);

  const sendOtp = async () => {
    setLoading(true);
    setMessage('');

    if (!mobile) {
      setMessage('Mobile number is required');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending OTP to:', mobile);
      const result = await firebaseSmsService.sendOTP(mobile);

      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setMessage('OTP sent successfully! Check your phone.');
        console.log('OTP sent successfully');
      } else {
        setMessage(`Error: ${result.error}`);
        console.error('OTP send failed:', result.error);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error('OTP send error:', error);
    } finally {
      setLoading(false);
      updateDebugInfo();
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage('');

    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    if (!confirmationResult) {
      setMessage('No OTP session found. Please send OTP first.');
      setLoading(false);
      return;
    }

    try {
      console.log('Verifying OTP:', otp);
      const result = await firebaseSmsService.verifyOTP(
        confirmationResult,
        otp
      );

      if (result.success) {
        setMessage('OTP verified successfully! User authenticated.');
        console.log('OTP verified successfully');
      } else {
        setMessage(`Error: ${result.error}`);
        console.error('OTP verification failed:', result.error);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
      updateDebugInfo();
    }
  };

  const clearRecaptcha = async () => {
    setLoading(true);
    setMessage('');

    try {
      await firebaseSmsService.cleanup();
      setMessage('reCAPTCHA cleared successfully!');
      console.log('reCAPTCHA cleared');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error('Clear reCAPTCHA error:', error);
    } finally {
      setLoading(false);
      updateDebugInfo();
    }
  };

  const initializeRecaptcha = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await firebaseSmsService.initializeRecaptcha();
      if (result) {
        setMessage('reCAPTCHA initialized successfully!');
        console.log('reCAPTCHA initialized');
      } else {
        setMessage('Failed to initialize reCAPTCHA');
        console.error('Failed to initialize reCAPTCHA');
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error('Initialize reCAPTCHA error:', error);
    } finally {
      setLoading(false);
      updateDebugInfo();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Mobile OTP Test</h1>
      <p>
        This page tests the mobile OTP flow with reCAPTCHA initialization fixes.
      </p>

      {/* Development mode notice */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '5px',
            color: '#856404',
          }}
        >
          <h4>🔧 Development Mode Notice</h4>
          <p>
            <strong>
              You may not receive actual SMS in local development.
            </strong>
          </p>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Use test phone numbers from Firebase Console</li>
            <li>Check Firebase Console → Authentication → Users for logs</li>
            <li>For real SMS testing, deploy to production domain</li>
            <li>Monitor console for development mode messages</li>
          </ul>
        </div>
      )}

      {/* reCAPTCHA container */}
      <div id="recaptcha-container" style={{ marginBottom: '20px' }}></div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Step 1: Send OTP</h3>
        <input
          type="tel"
          placeholder="Enter phone number (e.g., 9876543210)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button
          onClick={sendOtp}
          disabled={loading || !mobile}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
          }}
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
        <button
          onClick={clearRecaptcha}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
          }}
        >
          Clear reCAPTCHA
        </button>
        <button
          onClick={initializeRecaptcha}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Initialize reCAPTCHA
        </button>
      </div>

      {confirmationResult && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Step 2: Verify OTP</h3>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button
            onClick={verifyOtp}
            disabled={loading || !otp}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>Debug Information</h3>
        <pre
          style={{
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            overflow: 'auto',
          }}
        >
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div
        style={{
          padding: '15px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '5px',
          marginTop: '20px',
        }}
      >
        <h4>📋 Testing Instructions</h4>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Enter a mobile number and click "Send OTP"</li>
          <li>Check browser console for development mode messages</li>
          <li>
            Visit Firebase Console → Authentication → Users to see OTP attempts
          </li>
          <li>
            Use the debug page (<code>/debug-recaptcha</code>) for configuration
            testing
          </li>
          <li>For real SMS testing, deploy to production domain</li>
        </ol>
      </div>

      <div
        style={{
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '5px',
          marginTop: '20px',
        }}
      >
        <h4>🔧 Troubleshooting</h4>
        <ul>
          <li>Check browser console for development mode messages</li>
          <li>
            Visit Firebase Console → Authentication → Users to see OTP attempts
          </li>
          <li>
            Use the debug page (<code>/debug-recaptcha</code>) for configuration
            testing
          </li>
          <li>For real SMS testing, deploy to production domain</li>
        </ul>
      </div>
    </div>
  );
} 