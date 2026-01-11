//DocumentMapper
//Contains all SQL queries related to document operations.
//Separates SQL logic from data access logic following the Mapper pattern.

export class DocumentMapper {

  static readonly SELECT_ALL_DOCUMENTS = 
    'SELECT id, name, folder_id, file_type, size, created_by, created_at FROM documents ORDER BY created_at DESC';

  static readonly SELECT_DOCUMENT_BY_ID = 
    'SELECT id, name, folder_id, file_type, size, created_by, created_at FROM documents WHERE id = ?';

  static readonly SELECT_DOCUMENTS_BY_FOLDER_ID = 
    'SELECT id, name, folder_id, file_type, size, created_by, created_at FROM documents WHERE folder_id = ? ORDER BY created_at DESC';

  static readonly SEARCH_DOCUMENTS_BY_NAME = 
    'SELECT id, name, folder_id, file_type, size, created_by, created_at FROM documents WHERE name LIKE ? ORDER BY created_at DESC';

  static readonly INSERT_DOCUMENT = 
    'INSERT INTO documents (name, folder_id, file_type, size, created_by) VALUES (?, ?, ?, ?, ?)';

  static readonly DELETE_DOCUMENT = 
    'DELETE FROM documents WHERE id = ?';

  static readonly COUNT_DOCUMENTS_IN_FOLDER = 
    'SELECT COUNT(*) as count FROM documents WHERE folder_id = ?';

  static getColumnNames(): string[] {
    return ['id', 'name', 'folder_id', 'file_type', 'size', 'created_by', 'created_at'];
  }

  static getTableName(): string {
    return 'documents';
  }

  static buildSearchPattern(searchTerm: string): string {
    return `%${searchTerm}%`;
  }
}
