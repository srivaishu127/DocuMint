import express from 'express';
import { getAllFolders, createFolder, deleteFolder } from '../controllers/folderController';

/**
 * Folder Routes
 * 
 * Defines API endpoints for folder operations
 * Base path: /api/folders
 */
const router = express.Router();

/**
 * @route   GET /api/folders
 * @desc    Get all folders
 * @access  Public
 */
router.get('/', getAllFolders);

/**
 * @route   POST /api/folders
 * @desc    Create a new folder
 * @access  Public
 */
router.post('/', createFolder);

/**
 * @route   DELETE /api/folders/:id
 * @desc    Delete a folder (cascade deletes all documents in it)
 * @access  Public
 */
router.delete('/:id', deleteFolder);

export default router;
