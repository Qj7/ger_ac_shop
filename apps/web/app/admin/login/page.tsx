import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-800 to-brand-500 p-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
