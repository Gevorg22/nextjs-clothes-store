'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Mail, KeyRound, ArrowRight, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthModalStore } from '@/store/auth-modal-store';

const emailSchema = z.object({
  email: z.string().email('Введите корректный email'),
});

const codeSchema = z.object({
  code: z.string().length(6, 'Код состоит из 6 цифр'),
});

type EmailForm = z.infer<typeof emailSchema>;
type CodeForm = z.infer<typeof codeSchema>;

export const AuthModal = () => {
  const { open, setOpen } = useAuthModalStore();
  const [step, setStep] = React.useState<'email' | 'code'>('email');
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const codeForm = useForm<CodeForm>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  const handleClose = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setTimeout(() => {
        setStep('email');
        emailForm.reset();
        codeForm.reset();
      }, 200);
    }
  };

  const onSendCode = async (data: EmailForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) throw new Error();

      setEmail(data.email);
      setStep('code');
      toast.success('Код отправлен на ваш email');
    } catch {
      toast.error('Не удалось отправить код. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyCode = async (data: CodeForm) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        code: data.code,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Неверный или просроченный код');
        return;
      }

      toast.success('Вы успешно вошли!');
      setOpen(false);
    } catch {
      toast.error('Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-8">
        <DialogHeader className="mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-black text-white mb-4">
            {step === 'email' ? <Mail size={22} /> : <KeyRound size={22} />}
          </div>
          <DialogTitle className="text-xl font-bold">
            {step === 'email' ? 'Войти в аккаунт' : 'Введите код'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email'
              ? 'Введите email — мы отправим код для входа'
              : `Код отправлен на ${email}`}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' ? (
          <form onSubmit={emailForm.handleSubmit(onSendCode)} className="flex flex-col gap-4 mt-2">
            <div>
              <Input
                {...emailForm.register('email')}
                placeholder="example@mail.com"
                type="email"
                disabled={loading}
                autoFocus
              />
              {emailForm.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Отправить код <ArrowRight size={16} className="ml-1" /></>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="flex flex-col gap-4 mt-2">
            <div>
              <Input
                {...codeForm.register('code')}
                placeholder="000000"
                maxLength={6}
                disabled={loading}
                autoFocus
                className="text-center text-2xl tracking-[0.5em] font-bold"
              />
              {codeForm.formState.errors.code && (
                <p className="text-xs text-red-500 mt-1">
                  {codeForm.formState.errors.code.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Подтвердить'
              )}
            </Button>
            <button
              type="button"
              onClick={() => { setStep('email'); codeForm.reset(); }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
            >
              Изменить email
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
