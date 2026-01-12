'use client'

import { useState } from 'react'

//AddDocumentModal Component
//Two-step modal for simulating document upload:
//Step 1: Drag/drop or click to simulate file selection
//Step 2: Fill in document details (name with auto-extracted file type, size)
//File type is automatically extracted from the filename (e.g., "report.pdf" → "pdf")
//Created by is hardcoded as "Evelyn Blue"

interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentFolderId: number | null
}

interface FormData {
  name: string
  size: string
}

interface FormErrors {
  name?: string
  size?: string
}

const VALID_FILE_TYPES = ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'jpg', 'png', 'zip']

export default function AddDocumentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  currentFolderId 
}: AddDocumentModalProps) {
  const [step, setStep] = useState<'upload' | 'form'>('upload')
  const [isDragOver, setIsDragOver] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    size: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setStep('form')
  }

  const handleClick = () => {
    setStep('form')
  }

  // Extract file extension from filename
  const getFileTypeFromName = (filename: string): string => {
    const lastDot = filename.lastIndexOf('.')
    if (lastDot === -1) return ''
    return filename.substring(lastDot + 1).toLowerCase()
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Document name is required'
    } else if (formData.name.length > 255) {
      newErrors.name = 'Document name cannot exceed 255 characters'
    } else {
      // Validate file extension
      const fileType = getFileTypeFromName(formData.name.trim())
      if (!fileType) {
        newErrors.name = 'File name must include an extension (e.g., .pdf, .docx)'
      } else if (!VALID_FILE_TYPES.includes(fileType)) {
        newErrors.name = `Invalid file type. Supported types: ${VALID_FILE_TYPES.join(', ')}`
      }
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

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const fileType = getFileTypeFromName(formData.name.trim())
      
      const payload = {
        name: formData.name.trim(),
        folder_id: currentFolderId || 1,
        file_type: fileType,
        size: Number(formData.size),
        created_by: 'Evelyn Blue'
      }

      const response = await fetch('http://localhost:3001/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create document')
      }

      setFormData({
        name: '',
        size: ''
      })
      setErrors({})
      setStep('upload')
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
      size: ''
    })
    setErrors({})
    setStep('upload')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Files</h2>
          <button className="close-btn" onClick={handleClose}>&times;</button>
        </div>

        {step === 'upload' ? (
          // Step 1: Drag and Drop Area
          <div className="upload-step">
            <div 
              className={`drag-drop-area ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <img src="/folder.png" alt="Upload" className="upload-icon-img" />
              <p className="upload-text">Click or drag file to this area to upload</p>
              <p className="upload-subtext">Demo: Please click to simulate file upload.</p>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Step 2: Form Fields
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
              <label htmlFor="documentSize">
                File Size (bytes) <span className="required">*</span>
              </label>
              <input
                id="documentSize"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 1024000"
                className={errors.size ? 'error' : ''}
                min="1"
              />
              {errors.size && <span className="error-message">{errors.size}</span>}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
