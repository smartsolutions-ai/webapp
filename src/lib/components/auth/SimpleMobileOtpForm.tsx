'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { firebaseSmsService } from '~/lib/utils/sms';
import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';

interface SimpleMobileOtpFormProps {
  issignup: number;
  istrialuser: number;
  onSuccess?: () => void;
}

const SimpleMobileOtpForm = (props: SimpleMobileOtpFormProps) => {
  console.log('SimpleMobileOtpForm rendered with props:', props);

  const { issignup, istrialuser, onSuccess } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [userName, setUserName] = useState('');
  const [referrerCode, setReferrerCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const signup = issignup === 1;
  const trialuser = istrialuser === 1;
  const router = useRouter();

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      firebaseSmsService.cleanup();
    };
  }, []);

  const checkMobile = async (mobileNumber: string) => {
    try {
      const response = await fetch('/api/auth/checkMobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      if (!response.ok) throw new Error('Failed to check mobile number');
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking mobile number:', error);
      return false;
    }
  };

  const sendOtp = async () => {
    console.log('sendOtp called with mobile:', mobile);
    console.log('Mobile length:', mobile.length);
    console.log('Mobile validation:', /^[6-9]\d{9}$/.test(mobile));
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!mobile) {
      setErrorMessage('Mobile number is required');
      setIsLoading(false);
      return;
    }

    if (mobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      setIsLoading(false);
      return;
    }

    try {
      const mobileCheck = await checkMobile(mobile);

      if (signup) {
        if (mobileCheck?.exists) {
          setErrorMessage(
            'An account with this mobile number already exists. Please login instead.'
          );
          setIsLoading(false);
          return;
        }
      } else {
        if (!mobileCheck?.exists) {
          setErrorMessage(
            'No account found with this mobile number. Please sign up first.'
          );
          setIsLoading(false);
          return;
        }
      }

      // Use Firebase to send OTP
      const result = await firebaseSmsService.sendOTP(mobile);

      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        setShowOtpInput(true);
        setSuccessMessage('OTP sent successfully to your mobile number');
        console.log('Firebase OTP sent successfully');
      } else {
        setErrorMessage(result.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('OTP error:', error);
      setErrorMessage('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    console.log('verifyOtp called with otp:', otp);
    setIsLoading(true);
    setErrorMessage('');

    if (!otp || otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    if (!confirmationResult) {
      setErrorMessage('No OTP session found. Please send OTP again.');
      setIsLoading(false);
      return;
    }

    try {
      // Use Firebase to verify OTP
      const result = await firebaseSmsService.verifyOTP(
        confirmationResult,
        otp
      );

      if (result.success && result.user) {
        setSuccessMessage(
          signup ? 'Account created successfully' : 'Login successful'
        );

        // Get Firebase ID token
        const token = await result.user.getIdToken();
        document.cookie = `token=${token}; path=/`;

        // Store user data
        localStorage.setItem('userMobile', mobile);
        localStorage.setItem('userName', userName || '');
        localStorage.setItem('userReferralCode', referrerCode || '');

        // Create/update user in database
        if (signup) {
          const userResponse = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: null,
              name: userName || '',
              mobile,
              referrerCode: referrerCode || null,
              isTrialUser: istrialuser === 1,
            }),
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('User created successfully:', userData);
          } else {
            const errorData = await userResponse.json();
            console.error('Failed to create user:', errorData);
            setErrorMessage(errorData.error || 'Failed to create user account');
            setIsLoading(false);
            return;
          }
        }

        if (onSuccess) {
          onSuccess();
        } else if (signup) {
          router.push('/profile');
        } else {
          router.push('/');
        }
      } else {
        setErrorMessage(result.error || 'Failed to verify OTP');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setErrorMessage('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  console.log('Rendering SimpleMobileOtpForm with state:', {
    mobile,
    mobileLength: mobile.length,
    isMobileValid: mobile.length >= 10,
    otp,
    showOtpInput,
    isLoading,
  });

  return (
    <>
      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      {!showOtpInput ? (
        <>
          <Box w="full">
            <Stack>
              <Input
                id="mobile"
                placeholder="Enter your mobile number"
                type="tel"
                value={mobile}
                onChange={handleMobileChange}
                maxLength={10}
                required
                height="50px"
                borderRadius="lg"
                borderWidth="2px"
                borderColor="gray.200"
                _focus={{ 
                  borderColor: "blue.500", 
                  boxShadow: "0 0 0 1px #3182ce",
                  bg: "white"
                }}
                _placeholder={{ 
                  color: 'gray.400',
                  fontSize: "sm"
                }}
                _hover={{ bg: "gray.50" }}
              />
              {signup && (
                <>
                  <Input
                    id="userName"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    height="50px"
                    borderRadius="lg"
                    borderWidth="2px"
                    borderColor="gray.200"
                    _focus={{ 
                      borderColor: "blue.500", 
                      boxShadow: "0 0 0 1px #3182ce",
                      bg: "white"
                    }}
                    _placeholder={{ 
                      color: 'gray.400',
                      fontSize: "sm"
                    }}
                    _hover={{ bg: "gray.50" }}
                  />
                  <Input
                    id="referrerCode"
                    placeholder="Referrer Code (optional)"
                    value={referrerCode}
                    onChange={(e) => setReferrerCode(e.target.value)}
                    height="50px"
                    borderRadius="lg"
                    borderWidth="2px"
                    borderColor="gray.200"
                    _focus={{ 
                      borderColor: "blue.500", 
                      boxShadow: "0 0 0 1px #3182ce",
                      bg: "white"
                    }}
                    _placeholder={{ 
                      color: 'gray.400',
                      fontSize: "sm"
                    }}
                    _hover={{ bg: "gray.50" }}
                  />
                </>
              )}
              {successMessage && (
                <Text color="green.500">{successMessage}</Text>
              )}
              {errorMessage && <Text color="red.500">{errorMessage}</Text>}
              <Text fontSize="xs" color="gray.500">
                Mobile: {mobile} (Length: {mobile.length}/10)
              </Text>
            </Stack>
          </Box>
          <Button
            color="white"
            bg={(!mobile || mobile.length < 10) ? "gray.300" : "blue.500"}
            _hover={{ 
              bg: (!mobile || mobile.length < 10) ? "gray.300" : "blue.600",
              transform: (!mobile || mobile.length < 10) ? "none" : "translateY(-1px)",
              boxShadow: (!mobile || mobile.length < 10) ? "none" : "0 4px 8px rgba(0,0,0,0.1)"
            }}
            _disabled={{ bg: 'gray.300', color: 'gray.500', cursor: 'not-allowed' }}
            isLoading={isLoading}
            loadingText="Sending..."
            width={'full'}
            onClick={sendOtp}
            disabled={!mobile || mobile.length < 10}
            transition="all 0.2s"
          >
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <Box w="full">
            <Stack>
              <Text textAlign="center" fontSize="lg" fontWeight="bold" mb={4}>
                Enter OTP sent to +91 {mobile}
              </Text>
              <Input
                id="otp"
                placeholder="000000"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                textAlign="center"
                fontSize="xl"
                fontWeight="bold"
                letterSpacing="0.3em"
                height="50px"
                borderRadius="lg"
                borderWidth="2px"
                borderColor="blue.200"
                _focus={{ 
                  borderColor: "blue.500", 
                  boxShadow: "0 0 0 1px #3182ce",
                  bg: "white"
                }}
                _placeholder={{ 
                  color: 'gray.300',
                  letterSpacing: "0.3em",
                  fontWeight: "normal"
                }}
                bg="gray.50"
                _hover={{ bg: "gray.100" }}
              />
              {successMessage && (
                <Text color="green.500">{successMessage}</Text>
              )}
              {errorMessage && <Text color="red.500">{errorMessage}</Text>}
            </Stack>
          </Box>
          <Button
            color="white"
            bg="blue.500"
            _hover={{ 
              bg: "blue.600",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}
            isLoading={isLoading}
            loadingText="Verifying..."
            width={'full'}
            onClick={verifyOtp}
            mb={2}
            transition="all 0.2s"
          >
            Verify OTP
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            width={'full'}
            onClick={() => {
              setShowOtpInput(false);
              setOtp('');
              setErrorMessage('');
              setConfirmationResult(null);
            }}
          >
            Change Mobile Number
          </Button>
        </>
      )}
    </>
  );
};

export default SimpleMobileOtpForm; 