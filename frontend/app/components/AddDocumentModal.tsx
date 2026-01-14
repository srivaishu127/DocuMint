'use client'

import { useState, useEffect, useRef } from 'react'

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
  existingDocumentNames?: string[]
}

interface FormData {
  name: string
}

interface FormErrors {
  name?: string
}

const VALID_FILE_TYPES = [
  // Documents
  'pdf','doc','docx','txt','rtf','odt','html','htm',
  // Images
  'jpg','jpeg','png','gif','bmp','tiff',
  // Spreadsheets
  'xls','xlsx','csv',
  // Presentations
  'ppt','pptx','pps','key',
  // Audio / Video
  'mp3','mp4','m4a','ogg','wav','webm',
  // Compressed / Other
  'zip','7z','rar','json','xml','md'
]

export default function AddDocumentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  currentFolderId 
  , existingDocumentNames = []
}: AddDocumentModalProps) {
  const [step, setStep] = useState<'upload' | 'form'>('upload')
  const [isDragOver, setIsDragOver] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingFile, setPendingFile] = useState<{
    name: string
    file_type: string
    size: number
    created_by: string
  } | null>(null)
  const [progressPercent, setProgressPercent] = useState(0)
  const progressAnimRef = useRef<number | null>(null)

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
      // Duplicate check: enforce unique name within the current folder/root
      const normalized = formData.name.trim().toLowerCase()
      if (existingDocumentNames.map(n => n.toLowerCase()).includes(normalized)) {
        newErrors.name = 'A document with this name already exists in the current location'
      }
    }

    // File size will be auto-generated on submit (random between 1 KB and 100 MB)

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Prepare pseudo-uploaded file and return to upload step for final Save
    const fileType = getFileTypeFromName(formData.name.trim())

    // Generate a random file size between 1 KB and 100 MB (in bytes)
    const MIN_SIZE = 1024 // 1 KB
    const MAX_SIZE = 100 * 1024 * 1024 // 100 MB
    const generatedSize = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE

    const CREATORS = [
      'Evelyn Blue',
      'Thomas Hardin',
      "Clara D'souza"
    ]
    const createdBy = CREATORS[Math.floor(Math.random() * CREATORS.length)]

    setPendingFile({
      name: formData.name.trim(),
      file_type: fileType,
      size: generatedSize,
      created_by: createdBy
    })

    // Clear form and go back to upload step to show preview
    setFormData({ name: '' })
    setErrors({})
    setStep('upload')
  }

  useEffect(() => {
    // animate progress from 0 -> 100 when pendingFile appears
    if (!pendingFile) {
      setProgressPercent(0)
      if (progressAnimRef.current) {
        cancelAnimationFrame(progressAnimRef.current)
        progressAnimRef.current = null
      }
      return
    }

    setProgressPercent(0)
    const duration = 800 // ms
    let start: number | null = null

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const pct = Math.min(100, (elapsed / duration) * 100)
      setProgressPercent(pct)
      if (elapsed < duration) {
        progressAnimRef.current = requestAnimationFrame(step)
      } else {
        progressAnimRef.current = null
      }
    }

    progressAnimRef.current = requestAnimationFrame(step)

    return () => {
      if (progressAnimRef.current) {
        cancelAnimationFrame(progressAnimRef.current)
        progressAnimRef.current = null
      }
    }
  }, [pendingFile])

  const handleSavePending = async () => {
    if (!pendingFile) return
    setIsSubmitting(true)
    try {
      const payload = {
        name: pendingFile.name,
        folder_id: currentFolderId || 1,
        file_type: pendingFile.file_type,
        size: pendingFile.size,
        created_by: pendingFile.created_by
      }

      const response = await fetch('http://localhost:3001/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create document')
      }

      setPendingFile(null)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error saving document:', err)
      // show basic error
      setErrors({ name: err instanceof Error ? err.message : 'Failed to save document' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // clear pending preview and reset progress animation
    setFormData({ name: '' })
    setErrors({})
    setStep('upload')
    setPendingFile(null)
    setProgressPercent(0)
    if (progressAnimRef.current) {
      cancelAnimationFrame(progressAnimRef.current)
      progressAnimRef.current = null
    }
    onClose()
  }

  // Ensure modal internal state is reset when parent closes the modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '' })
      setErrors({})
      setStep('upload')
      setPendingFile(null)
      setProgressPercent(0)
      if (progressAnimRef.current) {
        cancelAnimationFrame(progressAnimRef.current)
        progressAnimRef.current = null
      }
    }
  }, [isOpen])

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

            {pendingFile && (
              <div className="file-preview-row" style={{ marginTop: '1rem' }}>
                <div className="file-row-inner">
                  <div className="file-icon"> 
                    <img src="/doc.png" alt="file" style={{ width: 28, height: 28 }} />
                  </div>
                  <div className="file-info">
                    <div className="file-name">{pendingFile.name}</div>
                    <div className="file-meta">{(pendingFile.size / (1024*1024)).toFixed(2)} MB</div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>
                  <div className="file-actions">
                    <button className="btn-close" onClick={() => setPendingFile(null)} aria-label="Remove">×</button>
                  </div>
                </div>
              
              <div style={{ height: 12 }} />
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Close
              </button>
              {pendingFile && (
                <button type="button" className="btn-primary" onClick={handleSavePending} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              )}
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

            {/* File size is generated automatically on submit (random value within limits) */}

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
