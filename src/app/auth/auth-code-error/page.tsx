'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AUTH_CONFIG, type OAuthErrorCode } from '@/lib/auth/constants';

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = (searchParams.get('error') || 'default') as OAuthErrorCode;
  const errorDescription = searchParams.get('description');

  // Get error info from constants, fallback to default
  const errorInfo =
    AUTH_CONFIG.OAUTH_ERRORS[errorCode] || AUTH_CONFIG.OAUTH_ERRORS['default'];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive">
            <AlertCircle className="h-6 w-6 text-destructive-foreground" />
          </div>
          <CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>

        {errorDescription && (
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Details</AlertTitle>
              <AlertDescription className="mt-1 text-sm">
                {decodeURIComponent(errorDescription)}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}

        <CardFooter className="flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/auth/login">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <AuthCodeErrorContent />
    </Suspense>
  );
}
