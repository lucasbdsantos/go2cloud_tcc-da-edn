import { Router } from 'express';
import { register, login, me } from '../controllers/auth';
import { createEnrollment, getUserEnrollments, getAllEnrollments } from '../controllers/enrollments';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

// Auth routes — rate-limited: brute-force/credential-stuffing targets
router.post('/auth/register', authLimiter, register);
router.post('/auth/login', authLimiter, login);
router.get('/auth/me', authMiddleware, me);

// Enrollment routes
router.post('/enrollments', authMiddleware, createEnrollment);
router.get('/enrollments/user', authMiddleware, getUserEnrollments);
// Admin-only: lists every user's name + email. To promote an account, run
// `UPDATE users SET is_admin = true WHERE email = '...';` directly on the DB
// (no admin UI exists yet — out of scope for the TCC, documented here).
router.get('/enrollments', authMiddleware, requireAdmin, getAllEnrollments);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
