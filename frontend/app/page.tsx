'use client'

import { useState, useEffect } from 'react'
import '../styles/globals.scss'
import AddFolderModal from './components/AddFolderModal'
import AddDocumentModal from './components/AddDocumentModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'

// Main Page Component
// Document management interface with folder navigation, search, sorting, and pagination
// Root folder (ID=1) is hidden from UI but serves as the default container

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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc' | null>(null)

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
    setSearchQuery('')
    fetchDocuments()
    fetchFolders()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
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
        // Navigate back to root if we deleted the currently open folder
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

  const toggleSort = () => {
    if (sortOrder === null) {
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else {
      setSortOrder(null)
    }
    setDateSortOrder(null) // Reset date sort when name sort is active
  }

  const toggleDateSort = () => {
    if (dateSortOrder === null) {
      setDateSortOrder('asc')
    } else if (dateSortOrder === 'asc') {
      setDateSortOrder('desc')
    } else {
      setDateSortOrder(null)
    }
    setSortOrder(null) // Reset name sort when date sort is active
  }

  // Show folders only at root level, documents only when inside a folder
  // Root folder (ID=1) is excluded from display
  let allItems = currentFolderId === null
    ? [
        ...folders.filter(f => f.id !== 1).map(f => ({ ...f, type: 'folder' })),
        ...documents.filter(d => d.folder_id === 1).map(d => ({ ...d, type: 'document' }))
      ]
    : [...documents.map(d => ({ ...d, type: 'document' }))]

  // Apply search filter - search across ALL folders and documents globally
  if (searchQuery.trim().length > 0) {
    const query = searchQuery.toLowerCase().trim()
    // Search in all folders (except Root)
    const matchedFolders = folders
      .filter(f => f.id !== 1)
      .filter(f => 
        f.name.toLowerCase().includes(query) ||
        (f.created_by && f.created_by.toLowerCase().includes(query))
      )
      .map(f => ({ ...f, type: 'folder' }))
    
    // Search in all documents (all folders)
    const matchedDocuments = documents.filter(d => 
      d.name.toLowerCase().includes(query) ||
      (d.created_by && d.created_by.toLowerCase().includes(query))
    ).map(d => ({ ...d, type: 'document' }))

    allItems = [...matchedFolders, ...matchedDocuments]
  }

  // Apply sorting if active
  if (sortOrder) {
    allItems = [...allItems].sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (sortOrder === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0
      }
    })
  }

  // Apply date sorting if active
  if (dateSortOrder) {
    allItems = [...allItems].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      if (dateSortOrder === 'asc') {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  }
    
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(allItems.length / itemsPerPage)

  const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : null

  return (
    <div className="container">
      <div className="app-header">
        <div className="logo-section">
          <img 
            src="/documint-logo.png" 
            alt="DocuMint - Your document management tool" 
            className="logo-image"
          />
        </div>
        <div className="header-actions">
          <button className="btn-upload" onClick={() => setIsAddDocumentModalOpen(true)}>
            <img src="/upload.png" alt="Upload" className="btn-icon" />
            Upload Files
          </button>
          {!currentFolderId && (
            <button className="btn-create-folder" onClick={() => setIsAddFolderModalOpen(true)}>
              <img src="/add.png" alt="Add Folder" className="btn-icon" />
              Create a folder
            </button>
          )}
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={clearSearch} 
              className="clear-search-btn"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="breadcrumb">
          {currentFolderId ? (
            <div className="breadcrumb-row">
              <button className="btn-back btn-back-small" onClick={handleBackToRoot} aria-label="Back to Documents">←</button>
              <span className="breadcrumb-link" style={{ cursor: 'pointer', opacity: 0.8 }} onClick={handleBackToRoot}>Documents</span>
              <span> / {currentFolder?.name}</span>
            </div>
          ) : (
            'Documents/'
          )}
        </div>
      </div>

      <div className="table-container">
        {allItems.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No documents yet — upload your file first</h3>
            <p style={{ marginBottom: '1rem', opacity: 0.85 }}>You don't have any documents in this location. Click below to add your first file.</p>
            <button className="btn-primary" onClick={() => setIsAddDocumentModalOpen(true)}>Upload File</button>
          </div>
        ) : (
        <table className="document-table">
          <thead>
            <tr>
              <th>
                <div className="th-with-sort">
                  Name
                  <button className="sort-btn" onClick={toggleSort} title="Sort alphabetically">
                    {sortOrder === null && '⇅'}
                    {sortOrder === 'asc' && '↑'}
                    {sortOrder === 'desc' && '↓'}
                  </button>
                </div>
              </th>
              <th>Created by</th>
              <th>
                <div className="th-with-sort">
                  Date
                  <button className="sort-btn" onClick={toggleDateSort} title="Sort by date">
                    {dateSortOrder === null && '⇅'}
                    {dateSortOrder === 'asc' && '↑'}
                    {dateSortOrder === 'desc' && '↓'}
                  </button>
                </div>
              </th>
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
                    <img 
                      src={isFolder ? '/folder.png' : '/doc.png'} 
                      alt={isFolder ? 'Folder' : 'Document'} 
                      className="item-icon"
                    />
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
                      <img src="/delete.png" alt="Delete" className="delete-icon" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        )}
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, allItems.length)} of {allItems.length} items
        </div>
        <div className="pagination-controls">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
            disabled={currentPage === 1}
            className="pagination-arrow"
          >
            ←
          </button>
          {(() => {
            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
            
            if (endPage - startPage + 1 < maxPagesToShow) {
              startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }
            
            const pages = [];
            
            // First page
            if (startPage > 1) {
              pages.push(
                <button key={1} onClick={() => setCurrentPage(1)}>
                  1
                </button>
              );
              if (startPage > 2) {
                pages.push(<span key="dots1" className="pagination-dots">...</span>);
              }
            }
            
            // Middle pages
            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  className={currentPage === i ? 'active' : ''}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </button>
              );
            }
            
            // Last page
            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push(<span key="dots2" className="pagination-dots">...</span>);
              }
              pages.push(
                <button key={totalPages} onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </button>
              );
            }
            
            return pages;
          })()}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
            disabled={currentPage === totalPages}
            className="pagination-arrow"
          >
            →
          </button>
        </div>
      </div>

      <AddFolderModal 
        isOpen={isAddFolderModalOpen}
        onClose={() => setIsAddFolderModalOpen(false)}
        onSuccess={handleFolderSuccess}
        existingFolderNames={folders.filter(f => f.id !== 1).map(f => f.name.toLowerCase())}
      />

      <AddDocumentModal 
        isOpen={isAddDocumentModalOpen}
        onClose={() => setIsAddDocumentModalOpen(false)}
        onSuccess={handleDocumentSuccess}
        currentFolderId={currentFolderId}
        existingDocumentNames={
          currentFolderId === null
            ? documents.filter(d => d.folder_id === 1).map(d => d.name.toLowerCase())
            : documents.filter(d => d.folder_id === currentFolderId).map(d => d.name.toLowerCase())
        }
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
