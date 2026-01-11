import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Document, CreateDocumentDTO } from '../models';
import { DocumentMapper } from '../mappers';

//DocumentDAO
//Handles all database operations related to documents.
//Uses DocumentMapper for SQL query management (Mapper Pattern).

export class DocumentDAO {

  //findAllDocuments -> Retrieve all documents from database.

  async findAllDocuments(): Promise<Document[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      DocumentMapper.SELECT_ALL_DOCUMENTS
    );
    return rows as Document[];
  }

  //findDocumentById -> Find a document by its ID.

  async findDocumentById(id: number): Promise<Document | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      DocumentMapper.SELECT_DOCUMENT_BY_ID,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Document;
  }

  //findAllDocsByFolderId -> Find all documents in a specific folder.

  async findAllDocsByFolderId(folderId: number): Promise<Document[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      DocumentMapper.SELECT_DOCUMENTS_BY_FOLDER_ID,
      [folderId]
    );
    return rows as Document[];
  }

  //searchDocByName -> Search documents by name (case-insensitive partial match).

  async searchDocByName(searchQuery: string): Promise<Document[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      DocumentMapper.SEARCH_DOCUMENTS_BY_NAME,
      [DocumentMapper.buildSearchPattern(searchQuery)]
    );
    return rows as Document[];
  }

  //createDocument -> Create a new document in the database.

  async createDocument(documentData: CreateDocumentDTO): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      DocumentMapper.INSERT_DOCUMENT,
      [documentData.name, documentData.folder_id, documentData.file_type, documentData.size, documentData.created_by || null]
    );
    return result.insertId;
  }

  //deleteDocumentById -> Delete a document by ID.

  async deleteDocumentById(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      DocumentMapper.DELETE_DOCUMENT,
      [id]
    );
    return result.affectedRows > 0;
  }

  //documentCountInFolder -> Count total documents in a folder.

  async documentCountInFolder(folderId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      DocumentMapper.COUNT_DOCUMENTS_IN_FOLDER,
      [folderId]
    );
    return rows[0].count;
  }
}
