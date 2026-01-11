import { Request, Response } from 'express';
import { FolderService } from '../services/folderService';

const folderService = new FolderService();

//folderController
//Handles HTTP requests/responses for folder operations.
//Delegates business logic to the service layer.


//getAllFolders -> Retrieves all folders from the system via service layer.

export const getAllFolders = async (req: Request, res: Response): Promise<void> => {
  try {
    const folders = await folderService.getAllFolders();
    res.status(200).json(folders);
  } catch (error) {
    console.error('Controller: Error in getAllFolders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch folders';
    res.status(500).json({ error: errorMessage });
  }
};

//createFolder -> Creates a new folder via service layer with validation.

export const createFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, created_by } = req.body;
    const result = await folderService.createFolder(name, created_by);
    
    res.status(201).json({
      id: result.id,
      name: result.name,
      message: 'Folder created successfully'
    });
  } catch (error) {
    console.error('Controller: Error in createFolder:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create folder';
    const statusCode = errorMessage.includes('required') || 
                       errorMessage.includes('cannot') || 
                       errorMessage.includes('exceed') ? 400 : 500;
    
    res.status(statusCode).json({ error: errorMessage });
  }
};

//deleteFolder -> Deletes a folder by ID via service layer.

export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const folderId = Number(id);
    
    if (isNaN(folderId)) {
      res.status(400).json({ error: 'Invalid folder ID' });
      return;
    }
    
    await folderService.deleteFolder(folderId);
    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Controller: Error in deleteFolder:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete folder';
    const statusCode = errorMessage.includes('not found') ? 404 : 
                       errorMessage.includes('cannot delete') ? 400 : 500;
    
    res.status(statusCode).json({ error: errorMessage });
  }
};
