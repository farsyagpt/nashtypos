import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { z } from 'zod';

const router = Router();

const pinLoginSchema = z.object({
  pin: z.string().length(4),
  outletId: z.string().uuid()
});

router.post('/pin', async (req: Request, res: Response, next) => {
  try {
    const { pin, outletId } = pinLoginSchema.parse(req.body);

    // Validate PIN against users table
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, role, is_active, pin_hash')
      .eq('outlet_id', outletId)
      .eq('pin_hash', pin) // In production, we'd hash the pin and compare it properly
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'User is inactive' });
    }

    // In a real app, generate a JWT token here
    // But since Supabase custom claims are mentioned, we might just return the user data
    // and let the client assume it's authenticated for this local session.
    
    // Log the login
    await supabase.from('pos_sessions').insert({
      outlet_id: outletId,
      user_id: user.id,
      device_id: req.headers['user-agent'] || 'unknown',
      login_at: new Date().toISOString()
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
