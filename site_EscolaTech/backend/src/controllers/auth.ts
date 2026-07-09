import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../database/pool';
import { registerSchema, loginSchema } from '../schemas/validation';
import { generateToken, AuthRequest } from '../middleware/auth';

export async function register(req: any, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [data.email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email já registrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users 
       (email, password_hash, first_name, last_name, phone, state, city, course, experience_level, objective)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, email, first_name, last_name`,
      [
        data.email,
        hashedPassword,
        data.firstName,
        data.lastName,
        data.phone || null,
        data.state || null,
        data.city || null,
        data.course || null,
        data.experienceLevel || null,
        data.objective || null,
      ]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

export async function login(req: any, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name, is_admin FROM users WHERE email = $1',
      [data.email]
    );

    // Always run bcrypt.compare, even when the user doesn't exist, against a
    // dummy hash. Returning early skips the ~100ms bcrypt cost, which lets an
    // attacker distinguish "email exists" from "wrong password" purely by
    // response time — defeating the generic error message below.
    const DUMMY_HASH = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Q5b9C7c5b5J5e5e5e5e5e5e5e5e5e';
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(data.password, user?.password_hash || DUMMY_HASH);

    if (!user || !passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = generateToken(user.id, user.email, user.is_admin);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const result = await query(
      'SELECT id, email, first_name, last_name, phone, state, city, course FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      state: user.state,
      city: user.city,
      course: user.course,
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}
