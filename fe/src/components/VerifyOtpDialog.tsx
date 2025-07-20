import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export function VerifyOtpDialog({
  open,
  setOpen,
  onVerify,
  email,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  onVerify: (otp: string) => void;
  email: string;
}) {
  const [otp, setOtp] = React.useState('');
  const OTP_LENGTH = 6;

  const handleVerify = () => {
    if (otp.length === OTP_LENGTH) {
      onVerify(otp);
    } else {
      alert('Vui lòng nhập đầy đủ mã OTP!');
    }
  };

  React.useEffect(() => {
    if (!open) setOtp('');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nhập mã OTP</DialogTitle>
        </DialogHeader>
        <div className="my-4 flex flex-col items-center">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={setOtp}
            autoFocus
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, i) => (
                  <InputOTPSlot  key={i} {...slot} />
                ))}
              </InputOTPGroup>
            )}
          />
          <p className="text-sm text-gray-500 text-center mt-3">
            Mã OTP đã gửi đến: <b>{email}</b>
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleVerify} className="w-full">
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
