export function WeAccept() {
  return (
    <div className="mt-5 border-t border-gold/30 pt-4 pb-16 md:pb-0">
      <p className="inline-flex rounded-full bg-rose px-3 py-1.5 text-xs font-semibold text-white">
        We Accept / வி அக்செப்ட்
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <img src="/payments/gpay.svg" alt="GPay" className="h-9 w-auto rounded-md border border-gold/30 bg-white p-1" />
        <img src="/payments/phonepe.svg" alt="PhonePe" className="h-9 w-auto rounded-md border border-gold/30 bg-white p-0.5" />
        <img src="/payments/upi.svg" alt="UPI" className="h-9 w-auto rounded-md border border-gold/30 bg-white p-1" />
      </div>
    </div>
  );
}
