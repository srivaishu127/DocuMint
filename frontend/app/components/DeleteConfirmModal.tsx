'use client'

import { useState } from 'react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemType: 'folder' | 'document'
  itemName: string
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Error deleting:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <h2>Confirm Delete</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="delete-modal-body">
          <p className="delete-question">
            Are you sure you want to delete this {itemType}?
          </p>
          <div className="delete-item-name">
            {itemType === 'folder' && <img src="/folder.png" alt="Folder" className="delete-item-icon" />}
            {itemType === 'document' && <img src="/doc.png" alt="Document" className="delete-item-icon" />}
            {itemName}
          </div>
          {itemType === 'folder' && (
            <p className="delete-cascade-warning">
              This will also delete all documents inside this folder.
            </p>
          )}
        </div>

        <div className="delete-modal-footer">
          <button 
            className="delete-cancel-btn" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="delete-confirm-btn" 
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
