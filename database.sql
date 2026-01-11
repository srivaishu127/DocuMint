-- =====================================================
-- Documents Management System - Database Setup
-- =====================================================
-- This file creates the database schema and sample data
-- Run this file in MySQL to set up the database
-- =====================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS documents_management;

-- Use the database
USE documents_management;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS folders;

-- =====================================================
-- Table: folders
-- Stores folder information
-- =====================================================
CREATE TABLE folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_by VARCHAR(255) NOT NULL DEFAULT 'Unknown',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: documents
-- Stores document metadata (no actual file upload)
-- =====================================================
CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  folder_id INT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  size INT NOT NULL COMMENT 'File size in bytes',
  created_by VARCHAR(255) NOT NULL DEFAULT 'Unknown',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
  INDEX idx_folder_id (folder_id),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Sample Data: folders
-- Note: ID 1 is the "Root" folder for root-level documents (hidden in UI)
-- =====================================================
INSERT INTO folders (name, created_by, created_at) VALUES 
  ('Root', 'System', '2026-01-01 00:00:00'),
  ('Projects', 'Dolly Mae', '2026-01-07 17:06:02'),
  ('Reports', 'Desiree Roberts', '2026-01-07 17:06:02'),
  ('Invoices', 'Hayley May', '2026-01-07 17:06:02');

-- =====================================================
-- Sample Data: documents
-- Note: folder_id mapping: 1=Root, 2=Projects, 3=Reports, 4=Invoices
-- =====================================================
INSERT INTO documents (name, folder_id, file_type, size, created_by, created_at) VALUES 
  ('Project Plan.pdf', 2, 'pdf', 2048, 'Sarah June', '2026-01-07 17:06:02'),
  ('Technical Specification.docx', 2, 'docx', 4096, 'Hayley May', '2026-01-07 17:06:02'),
  ('Budget Report.xlsx', 3, 'xlsx', 1024, 'Richard Fern', '2026-01-07 17:06:02'),
  ('Monthly Summary.pdf', 3, 'pdf', 3072, 'Dolly Mae', '2026-01-07 17:06:02'),
  ('Invoice_Jan.pdf', 4, 'pdf', 512, 'Barbara Hudgens', '2026-01-07 17:06:02'),
  ('Invoice_Feb.pdf', 4, 'pdf', 768, 'Desiree Roberts', '2026-01-07 17:06:02'),
  ('Doc.pdf', 2, 'pdf', 1024, 'Ailee Lim', '2026-01-11 00:41:17');

-- =====================================================
-- Verify Setup
-- =====================================================
-- Uncomment the lines below to verify the setup
-- SELECT 'Folders created:' as Status, COUNT(*) as Count FROM folders;
-- SELECT 'Documents created:' as Status, COUNT(*) as Count FROM documents;
-- SELECT * FROM folders;
-- SELECT * FROM documents;

-- =====================================================
-- Setup Complete!
-- Database: documents_management
-- Tables: folders (4 rows including root), documents (7 rows)
-- Note: folder_id = 1 is the Root folder (hidden in UI)
-- Folder mapping: 1=Root, 2=Projects, 3=Reports, 4=Invoices
-- =====================================================
