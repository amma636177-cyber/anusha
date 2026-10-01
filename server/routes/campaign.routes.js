import express from 'express';
import { getCampaigns, createCampaign } from '../controllers/campaign.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampaigns);
router.post('/', protect, authorize('admin', 'super_admin', 'manager'), createCampaign);

export default router;
