// Firebase Phone Authentication SMS service
import { auth } from '~/lib/firebaseConfig';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from 'firebase/auth';

export interface FirebaseSMSConfig {
  recaptchaContainerId?: string;
}

export class FirebaseSMSService {
  private config: FirebaseSMSConfig;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private retryCount = 0;
  private maxRetries = 3;
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor(config: FirebaseSMSConfig = {}) {
    this.config = config;
  }

  // Check if reCAPTCHA is ready and valid
  async isRecaptchaReady(): Promise<boolean> {
    try {
      if (!this.recaptchaVerifier) {
        return false;
      }

      // Test if the verifier is still valid
      await this.recaptchaVerifier.verify();
      return true;
    } catch (error) {
      console.log('reCAPTCHA not ready:', error);
      return false;
    }
  }

  // Force reinitialize reCAPTCHA (clears existing instance first)
  async forceReinitializeRecaptcha(
    containerId: string = 'recaptcha-container'
  ): Promise<boolean> {
    try {
      // Clear existing verifier
      if (this.recaptchaVerifier) {
        try {
          await this.recaptchaVerifier.clear();
        } catch (clearError) {
          console.warn('Failed to clear existing reCAPTCHA:', clearError);
        }
        this.recaptchaVerifier = null;
      }

      // Clear container
      const container = document.getElementById(containerId);
      if (container) {
        this.clearRecaptchaFromContainer(container);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Reset retry count
      this.retryCount = 0;

      // Initialize fresh instance
      return await this.initializeRecaptcha(containerId);
    } catch (error) {
      console.error('Failed to force reinitialize reCAPTCHA:', error);
      return false;
    }
  }

  // Initialize reCAPTCHA verifier with retry mechanism
  async initializeRecaptcha(
    containerId: string = 'recaptcha-container'
  ): Promise<boolean> {
    try {
      // Check if container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`reCAPTCHA container with id '${containerId}' not found`);
        return false;
      }

      // Check if grecaptcha is available
      if (typeof (window as any).grecaptcha === 'undefined') {
        console.log('grecaptcha is not available. Loading reCAPTCHA script...');
        try {
          await this.loadRecaptchaScript();
        } catch (error) {
          console.error('Failed to load reCAPTCHA script:', error);
          return false;
        }

        // Wait for script to load with timeout
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds total
        while (
          typeof (window as any).grecaptcha === 'undefined' &&
          attempts < maxAttempts
        ) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          attempts++;
          console.log(`Waiting for grecaptcha... attempt ${attempts}/${maxAttempts}`);
        }

        if (typeof (window as any).grecaptcha === 'undefined') {
          console.error('Failed to load reCAPTCHA script after all attempts');
          return false;
        }
      }

      // Check if we already have a valid verifier
      if (this.recaptchaVerifier) {
        try {
          // Test if the verifier is still valid by checking if it can be used
          await this.recaptchaVerifier.verify();
          console.log('Using existing reCAPTCHA verifier');
          return true;
        } catch (error) {
          console.log('Existing verifier is invalid, creating new one');
          // If verification fails, clear the old verifier
          try {
            await this.recaptchaVerifier.clear();
          } catch (clearError) {
            console.warn('Failed to clear existing reCAPTCHA:', clearError);
          }
          this.recaptchaVerifier = null;
        }
      }

      // Clear any existing reCAPTCHA instances from the container
      this.clearRecaptchaFromContainer(container);

      // Wait a bit to ensure DOM is ready and any previous instances are cleared
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Create new reCAPTCHA verifier
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved successfully');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          // Reset the verifier when expired
          this.recaptchaVerifier = null;
        },
        'error-callback': () => {
          console.error('reCAPTCHA error occurred');
          this.recaptchaVerifier = null;
        },
      });

      // Render the reCAPTCHA
      await this.recaptchaVerifier.render();

      console.log('reCAPTCHA initialized successfully');
      console.log('reCAPTCHA verifier:', this.recaptchaVerifier);
      this.retryCount = 0; // Reset retry count on success
      return true;
    } catch (error: any) {
      console.error('Failed to initialize reCAPTCHA:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
      });

      // If the error is about reCAPTCHA already being rendered, try to clear and retry once
      if (error.message && error.message.includes('already been rendered')) {
        console.log('reCAPTCHA already rendered, clearing and retrying...');
        this.recaptchaVerifier = null;

        // Clear the container completely
        const container = document.getElementById(containerId);
        if (container) {
          this.clearRecaptchaFromContainer(container);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Only retry once for this specific error
        if (this.retryCount === 0) {
          this.retryCount++;
          return this.initializeRecaptcha(containerId);
        }
      }

      this.recaptchaVerifier = null;

      // Retry logic for other errors
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(
          `Retrying reCAPTCHA initialization (${this.retryCount}/${this.maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return this.initializeRecaptcha(containerId);
      }

      return false;
    }
  }

  // Helper method to load reCAPTCHA script
  private loadRecaptchaScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="recaptcha"]')) {
        console.log('reCAPTCHA script already exists');
        resolve();
        return;
      }

      // Check if grecaptcha is already available
      if (typeof (window as any).grecaptcha !== 'undefined') {
        console.log('grecaptcha already available');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('reCAPTCHA script loaded successfully');
        // Wait a bit more to ensure grecaptcha is fully initialized
        setTimeout(() => {
          if (typeof (window as any).grecaptcha !== 'undefined') {
            console.log('grecaptcha is now available');
            resolve();
          } else {
            console.error('grecaptcha still not available after script load');
            reject(new Error('grecaptcha not available after script load'));
          }
        }, 1000);
      };

      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        reject(new Error('Failed to load reCAPTCHA script'));
      };

      document.head.appendChild(script);
    });
  }

  // Helper method to clear reCAPTCHA elements from container
  private clearRecaptchaFromContainer(container: HTMLElement) {
    try {
      // Remove any existing reCAPTCHA iframes
      const iframes = container.querySelectorAll('iframe[src*="recaptcha"]');
      iframes.forEach((iframe) => iframe.remove());

      // Remove any existing reCAPTCHA divs
      const recaptchaDivs = container.querySelectorAll(
        '.grecaptcha-badge, [data-sitekey], .g-recaptcha'
      );
      recaptchaDivs.forEach((div) => div.remove());

      // Remove any script tags that might have been added
      const scripts = container.querySelectorAll('script[src*="recaptcha"]');
      scripts.forEach((script) => script.remove());

      // Clear the container content but keep the container itself
      container.innerHTML = '';

      // Also try to reset grecaptcha if it exists
      if (typeof (window as any).grecaptcha !== 'undefined') {
        try {
          // Check if reset method exists before calling it
          if (typeof (window as any).grecaptcha.reset === 'function') {
            (window as any).grecaptcha.reset();
          } else {
            console.log('grecaptcha.reset() method not available');
          }
        } catch (resetError) {
          console.warn('Failed to reset grecaptcha:', resetError);
        }
      }
    } catch (error) {
      console.warn('Failed to clear reCAPTCHA elements:', error);
    }
  }

  // Send OTP using Firebase Phone Authentication
  async sendOTP(
    phoneNumber: string
  ): Promise<{ success: boolean; confirmationResult?: any; error?: string }> {
    try {
      // Check if reCAPTCHA is already initialized and valid
      if (!this.recaptchaVerifier) {
        const initialized = await this.initializeRecaptcha();
        if (!initialized) {
          return {
            success: false,
            error:
              'Failed to initialize reCAPTCHA. Please refresh the page and try again.',
          };
        }
      } else {
        // Test if existing verifier is still valid
        try {
          await this.recaptchaVerifier.verify();
          console.log('Using existing reCAPTCHA verifier for OTP');
        } catch (error) {
          console.log('Existing verifier invalid, reinitializing...');
          const initialized = await this.initializeRecaptcha();
          if (!initialized) {
            return {
              success: false,
              error:
                'Failed to initialize reCAPTCHA. Please refresh the page and try again.',
            };
          }
        }
      }

      // Ensure we have a valid verifier
      if (!this.recaptchaVerifier) {
        // In development mode, provide a more helpful error message
        if (this.isDevelopment) {
          return {
            success: false,
            error:
              'reCAPTCHA not initialized. This might be due to network issues or domain restrictions. Please check your internet connection and try again.',
          };
        }
        return {
          success: false,
          error:
            'reCAPTCHA not initialized. Please refresh the page and try again.',
        };
      }

      // Format phone number with country code if not already formatted
      const formattedPhone = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+91${phoneNumber}`;

      console.log(`📱 Sending Firebase OTP to ${formattedPhone}`);

      // In development mode, provide helpful information
      if (this.isDevelopment) {
        console.log(
          '🔧 DEVELOPMENT MODE: Firebase Phone Auth may not send actual SMS'
        );
        console.log('📋 For testing, use these methods:');
        console.log('   1. Use test phone numbers from Firebase Console');
        console.log(
          '   2. Check Firebase Console → Authentication → Users for OTP logs'
        );
        console.log('   3. Use the debug page to test reCAPTCHA functionality');
        console.log('   4. For real testing, deploy to a production domain');
      }

      // Send OTP using Firebase
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier!
      );

      console.log('Firebase OTP sent successfully');

      // In development, provide additional guidance
      if (this.isDevelopment) {
        console.log(
          '✅ OTP request successful! Check Firebase Console for delivery status.'
        );
        console.log("📱 If you don't receive SMS, try:");
        console.log('   - Using a test phone number');
        console.log('   - Checking Firebase Console logs');
        console.log('   - Verifying domain authorization');
      }

      return {
        success: true,
        confirmationResult,
      };
    } catch (error: any) {
      console.error('Firebase OTP sending failed:', error);

      // Handle specific Firebase errors
      let errorMessage = 'Failed to send OTP';
      console.log('Firebase error code:', error.code);
      console.log('Firebase error message:', error.message);

      if (error.code === 'auth/invalid-phone-number') {
        errorMessage =
          'Invalid phone number format. Please enter a valid mobile number.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage =
          'Too many requests. Please wait a few minutes before trying again.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage =
          'reCAPTCHA verification failed. Please refresh the page and try again.';
        // Reset the verifier for this error
        this.recaptchaVerifier = null;
      } else if (error.code === 'auth/invalid-app-credential') {
        errorMessage =
          'reCAPTCHA verification failed. Please refresh the page and try again.';
        // Reset the verifier for this error
        this.recaptchaVerifier = null;
      } else if (error.code === 'auth/billing-not-enabled') {
        errorMessage =
          'Phone authentication requires billing to be enabled. Please contact support.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage =
          'Phone authentication is not enabled. Please contact support.';
      } else {
        // Log the full error for debugging
        console.error('Unhandled Firebase error:', error);
        errorMessage = `Authentication error: ${error.message || error.code}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Verify OTP using Firebase
  async verifyOTP(
    confirmationResult: any,
    otp: string
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log(`🔐 Verifying Firebase OTP: ${otp}`);

      const result = await confirmationResult.confirm(otp);

      console.log('Firebase OTP verified successfully');
      return {
        success: true,
        user: result.user,
      };
    } catch (error: any) {
      console.error('Firebase OTP verification failed:', error);

      let errorMessage = 'Failed to verify OTP';

      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP has expired. Please request a new one.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Clean up reCAPTCHA
  async cleanup() {
    try {
      if (this.recaptchaVerifier) {
        await this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      // Also clear any reCAPTCHA elements from the container
      const container = document.getElementById('recaptcha-container');
      if (container) {
        this.clearRecaptchaFromContainer(container);
      }
    } catch (error) {
      console.error('Failed to cleanup reCAPTCHA:', error);
    }
  }
}

// Export a default instance
export const firebaseSmsService = new FirebaseSMSService(); 