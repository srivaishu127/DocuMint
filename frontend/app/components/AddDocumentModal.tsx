'use client'

import { useState } from 'react'

//AddDocumentModal Component
//Modal for creating new documents.
//Documents can be added at root level (folder_id = 1) or inside specific folders.
//The folder_id is automatically determined from the current folder context.
//- At root level (currentFolderId === null): Uses folder_id = 1 (Root folder)
//- Inside a folder (currentFolderId !== null): Uses the actual folder ID

interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentFolderId: number | null  // null = at root level, number = inside a folder
}

interface FormData {
  name: string
  file_type: string
  size: string
  created_by: string
}

interface FormErrors {
  name?: string
  file_type?: string
  size?: string
}

const VALID_FILE_TYPES = ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'jpg', 'png', 'zip']

export default function AddDocumentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  currentFolderId 
}: AddDocumentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    file_type: '',
    size: '',
    created_by: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Document name is required'
    } else if (formData.name.length > 255) {
      newErrors.name = 'Document name cannot exceed 255 characters'
    }

    if (!formData.file_type.trim()) {
      newErrors.file_type = 'File type is required'
    } else if (!VALID_FILE_TYPES.includes(formData.file_type.toLowerCase())) {
      newErrors.file_type = `File type must be one of: ${VALID_FILE_TYPES.join(', ')}`
    }

    if (!formData.size) {
      newErrors.size = 'File size is required'
    } else if (isNaN(Number(formData.size)) || Number(formData.size) <= 0) {
      newErrors.size = 'File size must be a positive number'
    } else if (Number(formData.size) > 100 * 1024 * 1024) {
      newErrors.size = 'File size cannot exceed 100 MB'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Use folder_id = 1 (Root) for root level, otherwise use the current folder ID
      const folderId = currentFolderId !== null ? currentFolderId : 1

      const payload = {
        name: formData.name.trim(),
        folder_id: folderId,
        file_type: formData.file_type.toLowerCase(),
        size: Number(formData.size),
        created_by: formData.created_by.trim() || 'Unknown'
      }

      const response = await fetch('http://localhost:3001/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create document')
      }

      setFormData({
        name: '',
        file_type: '',
        size: '',
        created_by: ''
      })
      setErrors({})
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating document:', error)
      setErrors({ name: error instanceof Error ? error.message : 'Failed to create document' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      file_type: '',
      size: '',
      created_by: ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Document</h2>
          <button className="close-btn" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="documentName">
              Document Name <span className="required">*</span>
            </label>
            <input
              id="documentName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Report.pdf"
              className={errors.name ? 'error' : ''}
              maxLength={255}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fileType">
              File Type <span className="required">*</span>
            </label>
            <select
              id="fileType"
              value={formData.file_type}
              onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
              className={errors.file_type ? 'error' : ''}
            >
              <option value="">Select file type</option>
              {VALID_FILE_TYPES.map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
            {errors.file_type && <span className="error-message">{errors.file_type}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fileSize">
              File Size (bytes) <span className="required">*</span>
            </label>
            <input
              id="fileSize"
              type="number"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              placeholder="e.g., 2048"
              className={errors.size ? 'error' : ''}
              min="1"
            />
            {errors.size && <span className="error-message">{errors.size}</span>}
            <small className="help-text">1 KB = 1024 bytes, 1 MB = 1048576 bytes</small>
          </div>

          <div className="form-group">
            <label htmlFor="createdBy">Created By</label>
            <input
              id="createdBy"
              type="text"
              value={formData.created_by}
              onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
              placeholder="Enter creator name (optional)"
              maxLength={255}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
