'use client'

import { useState, useEffect, useRef } from 'react'

//AddDocumentModal Component
//Multi-file upload modal:
//Step 1: Drag/drop or click to simulate file selection (can add multiple files)
//Step 2: Fill in document details (name with auto-extracted file type, size)
//Files stack vertically with individual progress bars and remove buttons
//When Save is pressed, all files are uploaded in batch

interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentFolderId: number | null
  existingDocumentNames?: string[]
}

interface PendingFile {
  id: string
  name: string
  file_type: string
  size: number
  created_by: string
  progress: number
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
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const progressAnimRefs = useRef<Map<string, number>>(new Map())

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
      // Duplicate check: enforce unique name within the current folder/root and pending files
      const normalized = formData.name.trim().toLowerCase()
      const allNames = [...existingDocumentNames, ...pendingFiles.map(f => f.name)]
      if (allNames.map(n => n.toLowerCase()).includes(normalized)) {
        newErrors.name = 'A document with this name already exists or is already queued for upload'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Prepare pseudo-uploaded file and add to pending files list
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

    const newFile: PendingFile = {
      id: Date.now().toString() + Math.random(),
      name: formData.name.trim(),
      file_type: fileType,
      size: generatedSize,
      created_by: createdBy,
      progress: 0
    }

    setPendingFiles(prev => [...prev, newFile])

    // Clear form and go back to upload step to show preview
    setFormData({ name: '' })
    setErrors({})
    setStep('upload')

    // Animate progress for this file
    animateFileProgress(newFile.id)
  }

  const animateFileProgress = (fileId: string) => {
    const duration = 800 // ms
    let start: number | null = null

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const pct = Math.min(100, (elapsed / duration) * 100)
      
      setPendingFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, progress: pct } : f)
      )

      if (elapsed < duration) {
        const animId = requestAnimationFrame(step)
        progressAnimRefs.current.set(fileId, animId)
      } else {
        progressAnimRefs.current.delete(fileId)
      }
    }

    const animId = requestAnimationFrame(step)
    progressAnimRefs.current.set(fileId, animId)
  }

  const removeFile = (fileId: string) => {
    // Cancel animation if running
    const animId = progressAnimRefs.current.get(fileId)
    if (animId) {
      cancelAnimationFrame(animId)
      progressAnimRefs.current.delete(fileId)
    }
    
    setPendingFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleSaveAll = async () => {
    if (pendingFiles.length === 0) return
    setIsSubmitting(true)
    
    try {
      // Upload all files in batch
      const uploadPromises = pendingFiles.map(file => {
        const payload = {
          name: file.name,
          folder_id: currentFolderId || 1,
          file_type: file.file_type,
          size: file.size,
          created_by: file.created_by
        }

        return fetch('http://localhost:3001/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.error || `Failed to upload ${file.name}`)
            })
          }
          return response.json()
        })
      })

      await Promise.all(uploadPromises)

      // Clear all pending files and close
      setPendingFiles([])
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error saving documents:', err)
      setErrors({ name: err instanceof Error ? err.message : 'Failed to save one or more documents' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Cancel all running animations
    progressAnimRefs.current.forEach(animId => cancelAnimationFrame(animId))
    progressAnimRefs.current.clear()
    
    // clear pending preview and reset
    setFormData({ name: '' })
    setErrors({})
    setStep('upload')
    setPendingFiles([])
    onClose()
  }

  // Ensure modal internal state is reset when parent closes the modal
  useEffect(() => {
    if (!isOpen) {
      // Cancel all running animations
      progressAnimRefs.current.forEach(animId => cancelAnimationFrame(animId))
      progressAnimRefs.current.clear()
      
      setFormData({ name: '' })
      setErrors({})
      setStep('upload')
      setPendingFiles([])
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
              <p className="upload-subtext">Demo: Click to simulate addition of single/multiple files.</p>
            </div>

            {pendingFiles.length > 0 ? (
              <div className="files-preview-container">
                {pendingFiles.map(file => (
                  <div key={file.id} className="file-preview-row" style={{ marginBottom: '0.75rem' }}>
                    <div className="file-row-inner">
                      <div className="file-icon"> 
                        <img src="/doc.png" alt="file" style={{ width: 28, height: 28 }} />
                      </div>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-meta">{(file.size / (1024*1024)).toFixed(2)} MB</div>
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${file.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="file-actions">
                        <button className="btn-close" onClick={() => removeFile(file.id)} aria-label="Remove">×</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-files-state">
                <p>No documents added</p>
              </div>
            )}

            <div className="modal-actions upload-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Close
              </button>
              {pendingFiles.length > 0 && (
                <button type="button" className="btn-primary" onClick={handleSaveAll} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : `Save ${pendingFiles.length > 1 ? `(${pendingFiles.length})` : ''}`}
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
