'use client';

import AuthForm from '~/lib/components/auth/auth';

function AuthPage() {
  return <AuthForm issignup={1} istrialuser={0} />;
}

export default AuthPage; 