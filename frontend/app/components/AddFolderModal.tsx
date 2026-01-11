'use client'

import { useState } from 'react'

interface AddFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  name: string
  created_by: string
}

interface FormErrors {
  name?: string
}

export default function AddFolderModal({ isOpen, onClose, onSuccess }: AddFolderModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    created_by: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Folder name is required'
    } else if (formData.name.length > 255) {
      newErrors.name = 'Folder name cannot exceed 255 characters'
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
      const payload = {
        name: formData.name.trim(),
        created_by: formData.created_by.trim() || 'Unknown'
      }

      const response = await fetch('http://localhost:3001/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create folder')
      }

      setFormData({ name: '', created_by: '' })
      setErrors({})
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating folder:', error)
      setErrors({ name: error instanceof Error ? error.message : 'Failed to create folder' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', created_by: '' })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Folder</h2>
          <button className="close-btn" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="folderName">
              Folder Name <span className="required">*</span>
            </label>
            <input
              id="folderName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter folder name"
              className={errors.name ? 'error' : ''}
              maxLength={255}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
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
