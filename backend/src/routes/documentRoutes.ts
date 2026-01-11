import express from 'express';
import { getAllDocuments, createDocument, searchDocuments, deleteDocument } from '../controllers/documentController';

/**
 * Document Routes
 * 
 * Defines API endpoints for document operations
 * Base path: /api/documents
 */
const router = express.Router();

/**
 * @route   GET /api/documents/search
 * @desc    Search documents by name
 * @query   query - Search term
 * @access  Public
 * 
 * IMPORTANT: This route must come BEFORE '/' route
 * Otherwise Express will treat 'search' as a document ID
 */
router.get('/search', searchDocuments);

/**
 * @route   GET /api/documents
 * @desc    Get all documents or filter by folder
 * @query   folder_id - Optional folder filter
 * @access  Public
 */
router.get('/', getAllDocuments);

/**
 * @route   POST /api/documents
 * @desc    Create a new document
 * @access  Public
 */
router.post('/', createDocument);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete a document
 * @access  Public
 */
router.delete('/:id', deleteDocument);

export default router;
