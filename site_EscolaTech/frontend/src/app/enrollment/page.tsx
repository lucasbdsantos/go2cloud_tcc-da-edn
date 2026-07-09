'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { authAPI, enrollmentAPI } from '@/lib/api';
import Link from 'next/link';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  state: string;
  city: string;
  course: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  objective: string;
};

const STATES = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

const COURSES = [
  { value: 'aws-solutions-architect', label: 'AWS Solutions Architect (60h)' },
  { value: 'devops-engineer-pro', label: 'DevOps Engineer Pro (85h)' },
  { value: 'terraform-masterclass', label: 'Terraform Masterclass (20h)' },
  { value: 'cloud-security', label: 'Cloud Security Specialist (45h)' },
  { value: 'data-engineering', label: 'Data Engineering na AWS (55h)' },
  { value: 'serverless-application', label: 'Serverless Application (30h)' },
];

const STEPS = ['Dados Pessoais', 'Localização e Curso', 'Experiência e Objetivo'];

export default function EnrollmentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur' });

  const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
    1: ['firstName', 'lastName', 'email', 'password'],
    2: ['state', 'city', 'course'],
    3: ['experienceLevel', 'objective'],
  };

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError('');

    try {
      // 1. Register user
      const registerRes = await authAPI.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        state: data.state,
        city: data.city,
        course: data.course,
        experienceLevel: data.experienceLevel,
        objective: data.objective,
      });

      // 2. Persist token
      const { token, user } = registerRes.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 3. Create enrollment
      await enrollmentAPI.create({
        courseName: data.course,
        state: data.state,
        city: data.city,
        experienceLevel: data.experienceLevel,
        objective: data.objective,
      });

      setSuccess(true);
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Erro ao realizar matrícula. Tente novamente.';
      setServerError(msg);
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-lg py-3xl">
        <div className="glass-card p-3xl text-center max-w-lg w-full space-y-lg rounded-2xl">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto" style={{ boxShadow: '0 0 40px rgba(142,213,255,0.3)' }}>
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="text-headline-md font-playfair text-primary text-2xl">Bem-vindo à GO2Cloud</h2>
          <p className="text-on-surface-variant">
            Sua jornada AWS começou. Verifique seu e-mail para os próximos passos de acesso à plataforma.
          </p>
          <Link href="/" className="inline-block mt-md bg-gradient-to-r from-primary to-secondary text-on-primary px-2xl py-md rounded-lg font-bold hover:scale-105 transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            Ir para a Plataforma
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-3xl px-lg flex items-center justify-center relative">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest to-surface pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Step indicator */}
        <div className="flex justify-center gap-lg mb-xl">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <div key={label} className="flex flex-col items-center gap-xs">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? 'bg-primary text-on-primary' : active ? 'bg-surface-container border-2 border-primary text-primary' : 'bg-surface-container text-outline border border-outline-variant'}`}>
                  {done ? <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span> : n}
                </div>
                <span className={`text-label-caps hidden sm:block ${active ? 'text-primary' : 'text-outline'}`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-0.5 bg-surface-container rounded-full mb-xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-2xl">
          <h1 className="text-headline-md font-playfair text-primary text-center mb-lg">
            {STEPS[step - 1]}
          </h1>

          {serverError && (
            <div className="mb-lg p-md rounded-lg bg-error-container/20 border border-error/30 text-error text-body-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <Input label="Primeiro Nome" placeholder="João"
                    {...register('firstName', { required: 'Nome obrigatório', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
                    error={errors.firstName?.message} />
                  <Input label="Sobrenome" placeholder="Silva"
                    {...register('lastName', { required: 'Sobrenome obrigatório', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
                    error={errors.lastName?.message} />
                </div>
                <Input label="Email" type="email" placeholder="seu@email.com"
                  {...register('email', { required: 'Email obrigatório', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' } })}
                  error={errors.email?.message} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <Input label="Telefone (opcional)" placeholder="(81) 99999-9999"
                    {...register('phone')} />
                  <Input label="Senha" type="password" placeholder="••••••••"
                    {...register('password', { required: 'Senha obrigatória', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })}
                    error={errors.password?.message} />
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="space-y-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <Select label="Estado" options={STATES}
                    {...register('state', { required: 'Estado obrigatório' })}
                    error={errors.state?.message} />
                  <Input label="Cidade" placeholder="Garanhuns"
                    {...register('city', { required: 'Cidade obrigatória' })}
                    error={errors.city?.message} />
                </div>
                <Select label="Qual trilha você deseja?" options={COURSES}
                  {...register('course', { required: 'Curso obrigatório' })}
                  error={errors.course?.message} />
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div className="space-y-md">
                <Select label="Nível de Experiência"
                  options={[
                    { value: 'beginner', label: 'Iniciante — nunca trabalhei com cloud' },
                    { value: 'intermediate', label: 'Intermediário — conheço o básico' },
                    { value: 'advanced', label: 'Avançado — já tenho experiência' },
                  ]}
                  {...register('experienceLevel', { required: 'Nível obrigatório' })}
                  error={errors.experienceLevel?.message} />
                <div>
                  <label htmlFor="objective" className="block text-body-sm font-semibold text-on-surface mb-sm">
                    Qual é seu objetivo principal?
                  </label>
                  <textarea
                    id="objective"
                    aria-invalid={!!errors.objective}
                    aria-describedby={errors.objective ? 'objective-error' : undefined}
                    className={`w-full px-md py-md bg-surface-container border rounded-lg text-on-surface placeholder-on-surface-variant input-glow focus:border-primary h-28 resize-none ${
                      errors.objective ? 'border-error' : 'border-outline-variant'
                    }`}
                    placeholder="Ex: Conseguir emprego em empresa internacional de cloud, obter certificação AWS..."
                    {...register('objective', { required: 'Objetivo obrigatório', minLength: { value: 10, message: 'Mínimo 10 caracteres' } })}
                  />
                  {errors.objective && <p id="objective-error" role="alert" className="text-error text-body-sm mt-xs">{errors.objective.message}</p>}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-md pt-md">
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => s - 1)}
                  className="flex-1 border border-outline-variant text-on-surface font-bold py-md rounded-lg hover:bg-surface-variant transition-colors">
                  Voltar
                </button>
              )}
              {step < 3 ? (
                <Button type="button" size="md" onClick={handleNext} className={step === 1 ? 'w-full' : 'flex-[2]'}>
                  Próximo Passo
                </Button>
              ) : (
                <Button type="submit" size="md" loading={loading} className="flex-[2]">
                  Finalizar Matrícula
                </Button>
              )}
            </div>

            <p className="text-center text-body-sm text-outline mt-md">
              Já possui conta?{' '}
              <Link href="/login" className="text-primary hover:underline">Faça login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
