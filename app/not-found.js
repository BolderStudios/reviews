'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function NotFoundContent() {
  const [previousPath, setPreviousPath] = useState('/');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prevPath = sessionStorage.getItem('previousPath') || '/';
      setPreviousPath(prevPath);
    }
  }, []);

  const handleGoBack = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-red-50 z-40">
      <h1>404 - Page Not Found — /not-found route</h1>
      <Button variant="link" onClick={handleGoBack}>
        Go back
      </Button>
      <Button variant="link" asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}