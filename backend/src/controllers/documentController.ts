import { Request, Response } from 'express';
import { DocumentService } from '../services/documentService';

const documentService = new DocumentService();

//documentController
//Handles HTTP requests/responses for document operations.
//Delegates business logic to the service layer.


//getAllDocuments -> Retrieves documents from the system via service layer.

export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folder_id } = req.query;
    const folderId = folder_id ? Number(folder_id) : undefined;
    
    const documents = await documentService.getDocuments(folderId);
    res.status(200).json(documents);
  } catch (error) {
    console.error('Controller: Error in getAllDocuments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch documents';
    const statusCode = errorMessage.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ error: errorMessage });
  }
};

//createDocument -> Creates a new document via service layer with validation.

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, folder_id, file_type, size, created_by } = req.body;
    
    const result = await documentService.createDocument({
      name,
      folder_id: Number(folder_id),
      file_type,
      size: Number(size),
      ...(created_by && { created_by })
    });
    
    res.status(201).json({
      id: result.id,
      name: result.name,
      message: 'Document created successfully'
    });
  } catch (error) {
    console.error('Controller: Error in createDocument:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create document';
    let statusCode = 500;
    
    if (errorMessage.includes('not found')) {
      statusCode = 404;
    } else if (errorMessage.includes('required') || 
               errorMessage.includes('must be') || 
               errorMessage.includes('cannot exceed')) {
      statusCode = 400;
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
};

//searchDocuments -> Searches for documents by name (case-insensitive partial match).

export const searchDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    const documents = await documentService.searchDocuments(String(query || ''));
    res.status(200).json(documents);
  } catch (error) {
    console.error('Controller: Error in searchDocuments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search documents';
    const statusCode = errorMessage.includes('required') || errorMessage.includes('must be') ? 400 : 500;
    res.status(statusCode).json({ error: errorMessage });
  }
};

//deleteDocument -> Deletes a document by ID via service layer.

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const documentId = Number(id);
    
    if (isNaN(documentId)) {
      res.status(400).json({ error: 'Invalid document ID' });
      return;
    }
    
    await documentService.deleteDocument(documentId);
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Controller: Error in deleteDocument:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete document';
    const statusCode = errorMessage.includes('not found') ? 404 : 500;
    
    res.status(statusCode).json({ error: errorMessage });
  }
};
