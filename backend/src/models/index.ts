//Type Definitions for Database Entities

//Folder entity from database

export interface Folder {
  id: number;
  name: string;
  created_by: string;
  created_at: Date;
}

//Document entity from database

export interface Document {
  id: number;
  name: string;
  folder_id: number;
  file_type: string;
  size: number;
  created_by: string;
  created_at: Date;
}

//DTO for creating a new folder

export interface CreateFolderDTO {
  name: string;
  created_by?: string;
}

//DTO for creating a new document

export interface CreateDocumentDTO {
  name: string;
  folder_id: number;
  file_type: string;
  size: number;
  created_by?: string;
}
