import PINProtection from '@/components/auth/PINProtection';

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PINProtection>
      {children}
    </PINProtection>
  );
}
