import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Folder, CreateFolderDTO } from '../models';
import { FolderMapper } from '../mappers';

//FolderDAO
//Handles all database operations related to folders.
//Uses FolderMapper for SQL query management (Mapper Pattern).

export class FolderDAO {

  //findAllFolders -> Retrieve all folders from database.

  async findAllFolders(): Promise<Folder[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      FolderMapper.SELECT_ALL_FOLDERS
    );
    return rows as Folder[];
  }

  //findFolderById -> Find a folder by its ID.

  async findFolderById(id: number): Promise<Folder | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      FolderMapper.SELECT_FOLDER_BY_ID,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Folder;
  }

  //create -> Create a new folder in the database.

  async create(folderData: CreateFolderDTO): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      FolderMapper.INSERT_FOLDER,
      [folderData.name, folderData.created_by || null]
    );
    return result.insertId;
  }

  //exists -> Check if a folder exists by ID.

  async exists(id: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      FolderMapper.CHECK_FOLDER_EXISTS,
      [id]
    );
    return rows.length > 0;
  }

  //delete -> Delete a folder by ID (CASCADE deletes all documents).

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      FolderMapper.DELETE_FOLDER,
      [id]
    );
    return result.affectedRows > 0;
  }
}
