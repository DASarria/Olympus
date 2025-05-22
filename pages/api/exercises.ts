// pages/api/exercises.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mockExercises from '@/api/gym-module/exerciseMockData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const part = (req.query.part as string)?.toLowerCase();
  
  if (!part) {
    return res.status(400).json({ error: 'Missing muscle group parameter' });
  }
  
  if (!mockExercises[part]) {
    return res.status(404).json({ error: 'Muscle group not found' });
  }
  
  res.status(200).json(mockExercises[part] || []);
}
