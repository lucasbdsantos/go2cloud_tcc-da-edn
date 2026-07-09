import { Response } from 'express';
import { query } from '../database/pool';
import { enrollmentSchema } from '../schemas/validation';
import { AuthRequest } from '../middleware/auth';

export async function createEnrollment(req: AuthRequest, res: Response) {
  try {
    const data = enrollmentSchema.parse(req.body);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Update user profile
    await query(
      `UPDATE users 
       SET state = $1, city = $2, course = $3, experience_level = $4, objective = $5
       WHERE id = $6`,
      [data.state, data.city, data.courseName, data.experienceLevel, data.objective, userId]
    );

    // Create enrollment record
    const result = await query(
      `INSERT INTO enrollments (user_id, course_name, status)
       VALUES ($1, $2, 'active')
       RETURNING id, user_id, course_name, enrollment_date, status`,
      [userId, data.courseName]
    );

    const enrollment = result.rows[0];

    res.status(201).json({
      id: enrollment.id,
      userId: enrollment.user_id,
      courseName: enrollment.course_name,
      enrollmentDate: enrollment.enrollment_date,
      status: enrollment.status,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Erro ao criar matrícula' });
  }
}

export async function getUserEnrollments(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const result = await query(
      `SELECT id, user_id, course_name, enrollment_date, status
       FROM enrollments
       WHERE user_id = $1
       ORDER BY enrollment_date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Erro ao buscar matrículas' });
  }
}

export async function getAllEnrollments(req: any, res: Response) {
  try {
    const result = await query(
      `SELECT e.id, e.user_id, e.course_name, e.enrollment_date, e.status,
              u.email, u.first_name, u.last_name
       FROM enrollments e
       JOIN users u ON e.user_id = u.id
       ORDER BY e.enrollment_date DESC
       LIMIT 100`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all enrollments error:', error);
    res.status(500).json({ error: 'Erro ao buscar matrículas' });
  }
}
