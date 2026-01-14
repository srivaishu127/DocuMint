'use client'

import { useState } from 'react'

// AddFolderModal Component
// Simple form modal for creating new folders
// Auto-assigns created_by as "Evelyn Blue" (hardcoded demo user)

interface AddFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  existingFolderNames?: string[]
}

interface FormData {
  name: string
}

interface FormErrors {
  name?: string
}

export default function AddFolderModal({ isOpen, onClose, onSuccess, existingFolderNames = [] }: AddFolderModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: ''
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

    // Duplicate folder name check (global among displayed folders)
    const normalized = formData.name.trim().toLowerCase()
    if (existingFolderNames.map(n => n.toLowerCase()).includes(normalized)) {
      newErrors.name = 'A folder with this name already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const CREATORS = [
        'Evelyn Blue',
        'Thomas Hardin',
        "Clara D'souza"
      ]
      const createdBy = CREATORS[Math.floor(Math.random() * CREATORS.length)]

      const payload = {
        name: formData.name.trim(),
        created_by: createdBy
      }

      const response = await fetch('http://localhost:3001/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create folder')
      }

      setFormData({
        name: ''
      })
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
    setFormData({
      name: ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Folder</h2>
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

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
