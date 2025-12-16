/**
 * Past Project Documents and Gallery Component
 * Displays relevant documents and project gallery (photos/videos) for past projects
 * Fully responsive and dynamic
 */

import { useState, useEffect } from 'react';
import { X, Play, Eye, Trash2 } from 'lucide-react';
import documentIcon from '../../../assets/icons/document.svg';
import DropdownMenu from '../../../components/ui/DropdownMenu';
import ConfirmModal from '../../../components/ui/ConfirmModal';

// Format date for grouping
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

// Group files by date
const groupFilesByDate = (files) => {
  return files.reduce((acc, file) => {
    const date = file.uploadDate || formatDate(file.date) || 'Unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(file);
    return acc;
  }, {});
};

// Static mock data for UI testing
const MOCK_DOCUMENTS = [
  {
    id: 'doc1',
    name: 'Final_Proposal.pdf',
    url: '#',
    size: '4.7 MB',
    date: '26 Sep 2024 3:20 PM',
    uploadDate: '26 Sep 2024',
  },
  {
    id: 'doc2',
    name: 'Terms_Conditions.pdf',
    url: '#',
    size: '9.5 MB',
    date: '26 Sep 2024 3:20 PM',
    uploadDate: '26 Sep 2024',
  },
  {
    id: 'doc3',
    name: 'Project_Estimate.xlsx',
    url: '#',
    size: '2.3 MB',
    date: '25 Sep 2024 2:15 PM',
    uploadDate: '25 Sep 2024',
  },
];

const MOCK_PHOTOS = [
  {
    id: 'photo1',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
    name: 'Construction Site 1',
    uploadDate: '26 Sep 2024',
  },
  {
    id: 'photo2',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
    name: 'Construction Site 2',
    uploadDate: '26 Sep 2024',
  },
  {
    id: 'photo3',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop',
    name: 'Construction Site 3',
    uploadDate: '26 Sep 2024',
  },
  {
    id: 'photo4',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop',
    name: 'Building Exterior',
    uploadDate: '25 Sep 2024',
  },
  {
    id: 'photo5',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop',
    name: 'Interior View',
    uploadDate: '25 Sep 2024',
  },
  {
    id: 'photo6',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=400&fit=crop',
    name: 'Foundation Work',
    uploadDate: '24 Sep 2024',
  },
];

const MOCK_VIDEOS = [
  {
    id: 'video1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    name: 'Project Progress Video',
    uploadDate: '26 Sep 2024',
  },
  {
    id: 'video2',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    name: 'Site Tour',
    uploadDate: '25 Sep 2024',
  },
];

export default function PastProjectDocumentsGallery({
  project,
  onDocumentDelete,
  showDocuments = true,
  showGallery = true,
}) {
  const [activeTab, setActiveTab] = useState('photos');
  const [documents, setDocuments] = useState([]);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [photoItems, setPhotoItems] = useState([]);
  const [videoItems, setVideoItems] = useState([]);

  // Initialize documents from project or mock data
  useEffect(() => {
    if (project?.documents && project.documents.length > 0) {
      setDocuments(project.documents);
    } else {
      setDocuments(MOCK_DOCUMENTS);
    }

    // Initialize photos and videos from project or mock data
    const initialPhotos =
      project?.photos && project.photos.length > 0 ? project.photos : MOCK_PHOTOS;
    const initialVideos =
      project?.videos && project.videos.length > 0 ? project.videos : MOCK_VIDEOS;

    setPhotoItems(initialPhotos);
    setVideoItems(initialVideos);
  }, [project]);

  const handleViewDocument = (doc) => {
    if (doc.url && doc.url !== '#') {
      window.open(doc.url, '_blank');
    } else {
      // If no URL, you could show a message or handle differently
      console.log('Document URL not available:', doc.name);
    }
  };

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc);
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      // Remove document from local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentToDelete.id));
      
      // Call parent callback if provided (for API integration)
      if (onDocumentDelete) {
        onDocumentDelete(documentToDelete.id);
      }
      
      setDocumentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDocumentToDelete(null);
  };

  const tabs = [
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Videos' },
  ];

  return (
    <>
      {/* Relevant Documents Section */}
      {showDocuments && documents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-primary mb-2">
            Relevant Documents
          </h2>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center bg-white gap-3 p-4 rounded-xl group cursor-pointer"
                onClick={() => {
                  if (doc.url && doc.url !== '#') {
                    window.open(doc.url, '_blank');
                  }
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img src={documentIcon} alt="Document" className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-primary-light ">
                    {doc.size} • {doc.date}
                  </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu
                    items={[
                      {
                        label: 'View Document',
                        onClick: () => handleViewDocument(doc),
                        icon: <Eye className="w-4 h-4" />,
                      },
                      {
                        label: 'Delete',
                        onClick: () => handleDeleteClick(doc),
                        icon: <Trash2 className="w-4 h-4 text-accent" />,
                        textColor: 'text-accent',
                      },
                    ]}
                    position="right"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Gallery Section */}
      {showGallery && (
      <div className="">
        <h2 className="text-lg sm:text-xl font-medium text-primary mb-4">
          Project Gallery
        </h2>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors md:px-6 ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <>
            {photoItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
                {photoItems.map((file) => (
                  <div
                    key={file.id}
                    className="relative group cursor-pointer w-[140px] sm:w-[160px]"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={file.url}
                        alt={file.name || 'Photo'}
                        className="w-full h-full object-cover"
                        onClick={() => {
                          // Open image in new tab for viewing
                          window.open(file.url, '_blank');
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoItems((prev) => prev.filter((item) => item.id !== file.id));
                      }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="w-3 h-3 text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary">
                <p className="text-sm">No photos uploaded yet</p>
              </div>
            )}
          </>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <>
            {videoItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
                {videoItems.map((file) => (
                  <div
                    key={file.id}
                    className="relative group cursor-pointer w-[140px] sm:w-[160px]"
                  >
                    <div className="aspect-square">
                      <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 relative">
                      <img
                        src={file.thumbnail || file.url}
                        alt={file.name || 'Video'}
                        className="w-full h-full object-cover"
                        onClick={() => {
                          // Open video in new tab for viewing
                          window.open(file.url, '_blank');
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 shadow-md flex items-center justify-center">
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 text-primary ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoItems((prev) => prev.filter((item) => item.id !== file.id));
                      }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="w-3 h-3 text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary">
                <p className="text-sm">No videos uploaded yet</p>
              </div>
            )}
          </>
        )}
      </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!documentToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message={
          documentToDelete ? (
            <p>
              Are you sure you want to delete{' '}
              <span className="font-medium text-primary">
                {documentToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>
          ) : (
            ''
          )
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="primary"
      />
    </>
  );
}

