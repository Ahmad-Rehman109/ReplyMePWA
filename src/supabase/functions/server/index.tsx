import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Profile routes
app.post('/make-server-7f94d273/profile', async (c) => {
  try {
    const { userId, profile } = await c.req.json();
    
    if (!userId || !profile) {
      return c.json({ error: 'Missing userId or profile' }, 400);
    }

    await kv.set(`profile:${userId}`, profile);
    
    return c.json({ success: true, profile });
  } catch (error) {
    console.log('Error saving profile:', error);
    return c.json({ error: 'Failed to save profile' }, 500);
  }
});

app.get('/make-server-7f94d273/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    const profile = await kv.get(`profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log('Error getting profile:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Settings routes
app.post('/make-server-7f94d273/settings', async (c) => {
  try {
    const { userId, settings } = await c.req.json();
    
    if (!userId || !settings) {
      return c.json({ error: 'Missing userId or settings' }, 400);
    }

    await kv.set(`settings:${userId}`, settings);
    
    return c.json({ success: true, settings });
  } catch (error) {
    console.log('Error saving settings:', error);
    return c.json({ error: 'Failed to save settings' }, 500);
  }
});

app.get('/make-server-7f94d273/settings/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    const settings = await kv.get(`settings:${userId}`);
    
    return c.json({ 
      settings: settings || {
        notifications: true,
        emailNotifications: false,
        pushNotifications: false
      }
    });
  } catch (error) {
    console.log('Error getting settings:', error);
    return c.json({ error: 'Failed to get settings' }, 500);
  }
});

app.get('/make-server-7f94d273/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
