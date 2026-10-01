import express from 'express';
import { getGroupDeals, getGroupDealById, createGroup, joinGroup } from '../controllers/group.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGroupDeals);
router.get('/:id', optionalAuth, getGroupDealById);
router.post('/', protect, createGroup);
router.post('/:id/join', protect, joinGroup);

export default router;
