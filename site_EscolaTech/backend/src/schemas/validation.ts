import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  phone: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  course: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  objective: z.string().optional(),
});

export const enrollmentSchema = z.object({
  courseName: z.string().min(2, 'Nome do curso inválido'),
  state: z.string().min(2, 'Estado inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  objective: z.string().min(10, 'Objetivo deve ter no mínimo 10 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha inválida'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
