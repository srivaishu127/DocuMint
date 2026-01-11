'use client'

import { useState, useEffect } from 'react'
import '../styles/globals.scss'
import AddFolderModal from './components/AddFolderModal'
import AddDocumentModal from './components/AddDocumentModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'

const API_URL = 'http://localhost:3001/api'

interface Folder {
  id: number
  name: string
  created_by: string
  created_at: string
}

interface Document {
  id: number
  name: string
  file_type: string
  size: number
  folder_id: number
  created_by: string
  created_at: string
}

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false)
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'folder' | 'document', id: number, name: string } | null>(null)

  useEffect(() => {
    fetchFolders()
    fetchDocuments()
  }, [])

  const fetchFolders = async () => {
    try {
      const response = await fetch(`${API_URL}/folders`)
      const data = await response.json()
      setFolders(data)
    } catch (error) {
      console.error('Error fetching folders:', error)
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/documents`)
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  const fetchDocumentsByFolder = async (folderId: number) => {
    try {
      const response = await fetch(`${API_URL}/documents?folder_id=${folderId}`)
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error('Error fetching folder documents:', error)
    }
  }

  const handleFolderClick = (folderId: number) => {
    setCurrentFolderId(folderId)
    setCurrentPage(1)
    fetchDocumentsByFolder(folderId)
  }

  const handleBackToRoot = () => {
    setCurrentFolderId(null)
    setCurrentPage(1)
    fetchDocuments()
  }

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      fetchDocuments()
      return
    }
    try {
      const response = await fetch(`${API_URL}/documents/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const handleFolderSuccess = () => {
    fetchFolders()
    setCurrentPage(1)
  }

  const handleDocumentSuccess = () => {
    if (currentFolderId) {
      fetchDocumentsByFolder(currentFolderId)
    } else {
      fetchDocuments()
    }
    setCurrentPage(1)
  }

  const handleDeleteClick = (type: 'folder' | 'document', id: number, name: string) => {
    setDeleteTarget({ type, id, name })
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    try {
      const endpoint = deleteTarget.type === 'folder' 
        ? `${API_URL}/folders/${deleteTarget.id}`
        : `${API_URL}/documents/${deleteTarget.id}`

      const response = await fetch(endpoint, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete ${deleteTarget.type}`)
      }

      // Refresh data after deletion
      if (deleteTarget.type === 'folder') {
        fetchFolders()
        // If we deleted the current folder, go back to root
        if (currentFolderId === deleteTarget.id) {
          setCurrentFolderId(null)
          fetchDocuments()
        }
      } else {
        if (currentFolderId) {
          fetchDocumentsByFolder(currentFolderId)
        } else {
          fetchDocuments()
        }
      }

      setCurrentPage(1)
    } catch (error) {
      console.error('Error deleting:', error)
      alert(`Failed to delete ${deleteTarget.type}`)
    }
  }

  // Show folders only at root level, documents only when inside a folder
  const allItems = currentFolderId === null
    ? [
        ...folders.filter(f => f.id !== 1).map(f => ({ ...f, type: 'folder' })),
        ...documents.filter(d => d.folder_id === 1).map(d => ({ ...d, type: 'document' }))
      ]
    : [...documents.map(d => ({ ...d, type: 'document' }))]
    
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(allItems.length / itemsPerPage)

  const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : null

  return (
    <div className="container">
      <div className="header">
        <h1>Documents {currentFolder && `/ ${currentFolder.name}`}</h1>
        <div className="header-actions">
          {currentFolderId && (
            <button className="btn-secondary" onClick={handleBackToRoot}>← Back</button>
          )}
          <button className="btn-secondary" onClick={() => setIsAddDocumentModalOpen(true)}>
            📤 Upload files
          </button>
          {!currentFolderId && (
            <button className="btn-primary" onClick={() => setIsAddFolderModalOpen(true)}>
              + Add new folder
            </button>
          )}
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}></button>
      </div>

      <div className="table-container">
        <table className="document-table">
          <thead>
            <tr>
              <th>📄 Name ↕️</th>
              <th>Created by</th>
              <th>Date ↕️</th>
              <th>File size</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item: any) => {
              const isFolder = item.type === 'folder'
              const itemId = item.id
              const itemName = item.name

              return (
                <tr key={`${item.type}-${itemId}`}>
                  <td 
                    className="name-cell" 
                    onClick={() => isFolder && handleFolderClick(itemId)}
                    style={{ cursor: isFolder ? 'pointer' : 'default' }}
                  >
                    <span className="icon">{isFolder ? '📁' : '📄'}</span>
                    {itemName}
                  </td>
                  <td>{item.created_by || 'Unknown'}</td>
                  <td>{new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>{isFolder ? '' : formatFileSize(item.size)}</td>
                  <td>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteClick(isFolder ? 'folder' : 'document', itemId, itemName)}
                      title={`Delete ${itemName}`}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Show {itemsPerPage} rows per page
        </div>
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
            
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={currentPage === page ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
            
          </button>
        </div>
      </div>

      <AddFolderModal 
        isOpen={isAddFolderModalOpen}
        onClose={() => setIsAddFolderModalOpen(false)}
        onSuccess={handleFolderSuccess}
      />

      <AddDocumentModal 
        isOpen={isAddDocumentModalOpen}
        onClose={() => setIsAddDocumentModalOpen(false)}
        onSuccess={handleDocumentSuccess}
        currentFolderId={currentFolderId}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleDeleteConfirm}
        itemType={deleteTarget?.type || 'document'}
        itemName={deleteTarget?.name || ''}
      />
    </div>
  )
}
