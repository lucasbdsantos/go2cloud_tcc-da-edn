'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login(data);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Email ou senha inválidos.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-lg py-3xl relative">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest to-surface pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card rounded-2xl p-2xl">
          <div className="text-center mb-xl">
            <Link href="/" className="text-headline-md font-playfair font-bold text-primary text-2xl flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
              GO2Cloud
            </Link>
            <p className="text-on-surface-variant mt-sm text-body-sm">Entre na sua conta</p>
          </div>

          {error && (
            <div className="mb-lg p-md rounded-lg bg-error-container/20 border border-error/30 text-error text-body-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
            <Input label="Email" type="email" placeholder="seu@email.com"
              {...register('email', { required: 'Email obrigatório' })}
              error={errors.email?.message} />
            <Input label="Senha" type="password" placeholder="••••••••"
              {...register('password', { required: 'Senha obrigatória' })}
              error={errors.password?.message} />

            <Button type="submit" size="md" loading={loading} className="w-full mt-md">
              Entrar
            </Button>

            <p className="text-center text-body-sm text-outline mt-md">
              Não tem conta?{' '}
              <Link href="/enrollment" className="text-primary hover:underline">Matricule-se gratuitamente</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
