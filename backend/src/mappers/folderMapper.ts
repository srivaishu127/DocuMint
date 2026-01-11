//FolderMapper
//Contains all SQL queries related to folder operations.
//Separates SQL logic from data access logic following the Mapper pattern.

export class FolderMapper {

  static readonly SELECT_ALL_FOLDERS = 
    'SELECT id, name, created_by, created_at FROM folders ORDER BY created_at DESC';

  static readonly SELECT_FOLDER_BY_ID = 
    'SELECT id, name, created_by, created_at FROM folders WHERE id = ?';

  static readonly CHECK_FOLDER_EXISTS = 
    'SELECT 1 FROM folders WHERE id = ? LIMIT 1';

  static readonly INSERT_FOLDER = 
    'INSERT INTO folders (name, created_by) VALUES (?, ?)';

  static readonly DELETE_FOLDER = 
    'DELETE FROM folders WHERE id = ?';

  static getColumnNames(): string[] {
    return ['id', 'name', 'created_by', 'created_at'];
  }

  static getTableName(): string {
    return 'folders';
  }
}
