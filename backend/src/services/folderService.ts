import { FolderDAO } from '../dao/folderDAO';
import { Folder, CreateFolderDTO } from '../models';

//FolderService
//Contains business logic for folder operations.
//Acts as an intermediary between controllers and data access layer.

export class FolderService {
  private folderDAO: FolderDAO;

  constructor() {
    this.folderDAO = new FolderDAO();
  }

  //getAllFolders -> Retrieves all folders from the database.

  async getAllFolders(): Promise<Folder[]> {
    try {
      return await this.folderDAO.findAllFolders();
    } catch (error) {
      console.error('Service: Error fetching folders:', error);
      throw new Error('Failed to retrieve folders');
    }
  }

  //getFolderById -> Get a folder by ID.

  async getFolderById(id: number): Promise<Folder> {
    try {
      const folder = await this.folderDAO.findFolderById(id);
      
      if (!folder) {
        throw new Error('Folder not found');
      }
      
      return folder;
    } catch (error) {
      console.error(`Service: Error fetching folder ${id}:`, error);
      throw error;
    }
  }

  //createFolder -> Creates a new folder with validation.

  async createFolder(name: string, created_by?: string): Promise<{ id: number; name: string }> {
    if (!name || name.trim() === '') {
      throw new Error('Folder name is required and cannot be empty');
    }

    if (name.length > 255) {
      throw new Error('Folder name cannot exceed 255 characters');
    }

    const trimmedName = name.trim();

    try {
      const folderId = await this.folderDAO.create({ 
        name: trimmedName,
        ...(created_by && { created_by: created_by.trim() })
      });
      
      return {
        id: folderId,
        name: trimmedName
      };
    } catch (error) {
      console.error('Service: Error creating folder:', error);
      throw new Error('Failed to create folder');
    }
  }

  //folderExists -> Check if a folder exists.

  async folderExists(id: number): Promise<boolean> {
    try {
      return await this.folderDAO.exists(id);
    } catch (error) {
      console.error(`Service: Error checking folder existence ${id}:`, error);
      throw new Error('Failed to verify folder existence');
    }
  }

  //deleteFolder -> Delete a folder (CASCADE deletes all its documents).

  async deleteFolder(id: number): Promise<boolean> {
    try {
      const exists = await this.folderDAO.exists(id);
      
      if (!exists) {
        throw new Error('Folder not found');
      }

      return await this.folderDAO.delete(id);
    } catch (error) {
      console.error(`Service: Error deleting folder ${id}:`, error);
      throw error;
    }
  }
}
