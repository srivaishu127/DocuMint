import { DocumentDAO } from '../dao/documentDAO';
import { FolderDAO } from '../dao/folderDAO';
import { Document, CreateDocumentDTO } from '../models';

//DocumentService
//Contains business logic for document operations.
//Acts as an intermediary between controllers and data access layer.

export class DocumentService {
  private documentDAO: DocumentDAO;
  private folderDAO: FolderDAO;

  constructor() {
    this.documentDAO = new DocumentDAO();
    this.folderDAO = new FolderDAO();
  }

  //getDocuments -> Get all documents or filter by folder.

  async getDocuments(folderId?: number): Promise<Document[]> {
    try {
      if (folderId) {
        const folderExists = await this.folderDAO.exists(folderId);
        if (!folderExists) {
          throw new Error('Folder not found');
        }
        
        return await this.documentDAO.findAllDocsByFolderId(folderId);
      }
      
      return await this.documentDAO.findAllDocuments();
    } catch (error) {
      console.error('Service: Error fetching documents:', error);
      throw error;
    }
  }

  //getDocumentById -> Get a document by ID.

  async getDocumentById(id: number): Promise<Document> {
    try {
      const document = await this.documentDAO.findDocumentById(id);
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      return document;
    } catch (error) {
      console.error(`Service: Error fetching document ${id}:`, error);
      throw error;
    }
  }

  //createDocument -> Validates input, verifies folder exists, and creates document.

  async createDocument(documentData: CreateDocumentDTO): Promise<{ id: number; name: string }> {
    if (!documentData.name || documentData.name.trim() === '') {
      throw new Error('Document name is required and cannot be empty');
    }

    if (!documentData.folder_id) {
      throw new Error('Folder ID is required');
    }

    if (!documentData.file_type || documentData.file_type.trim() === '') {
      throw new Error('File type is required');
    }

    if (!documentData.size || documentData.size <= 0) {
      throw new Error('File size must be greater than 0');
    }

    if (documentData.name.length > 255) {
      throw new Error('Document name cannot exceed 255 characters');
    }

    if (documentData.file_type.length > 50) {
      throw new Error('File type cannot exceed 50 characters');
    }

    const MAX_FILE_SIZE = 524288000;
    if (documentData.size > MAX_FILE_SIZE) {
      throw new Error('File size cannot exceed 500MB');
    }

    try {
      const folderExists = await this.folderDAO.exists(documentData.folder_id);
      
      if (!folderExists) {
        throw new Error('Folder not found. Please select a valid folder.');
      }

      const sanitizedData: CreateDocumentDTO = {
        name: documentData.name.trim(),
        folder_id: documentData.folder_id,
        file_type: documentData.file_type.trim().toLowerCase(),
        size: documentData.size,
        ...(documentData.created_by && { created_by: documentData.created_by.trim() })
      };

      const documentId = await this.documentDAO.createDocument(sanitizedData);
      
      return {
        id: documentId,
        name: sanitizedData.name
      };
    } catch (error) {
      console.error('Service: Error creating document:', error);
      throw error;
    }
  }

  //searchDocuments -> Performs case-insensitive partial match search on document names.

  async searchDocuments(searchQuery: string): Promise<Document[]> {
    if (!searchQuery || searchQuery.trim() === '') {
      throw new Error('Search query is required');
    }

    if (searchQuery.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }

    try {
      return await this.documentDAO.searchDocByName(searchQuery.trim());
    } catch (error) {
      console.error('Service: Error searching documents:', error);
      throw new Error('Failed to search documents');
    }
  }

  //deleteDocument -> Delete a document.

  async deleteDocument(id: number): Promise<boolean> {
    try {
      const document = await this.documentDAO.findDocumentById(id);
      
      if (!document) {
        throw new Error('Document not found');
      }

      return await this.documentDAO.deleteDocumentById(id);
    } catch (error) {
      console.error(`Service: Error deleting document ${id}:`, error);
      throw error;
    }
  }

  //getDocumentCountByFolder -> Get document count for a folder.

  async getDocumentCountByFolder(folderId: number): Promise<number> {
    try {
      const folderExists = await this.folderDAO.exists(folderId);
      if (!folderExists) {
        throw new Error('Folder not found');
      }

      return await this.documentDAO.documentCountInFolder(folderId);
    } catch (error) {
      console.error(`Service: Error counting documents for folder ${folderId}:`, error);
      throw error;
    }
  }
}
