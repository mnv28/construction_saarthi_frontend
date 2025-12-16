/**
 * Edit Past Project Page
 * Shows editable form with existing details and upload sections (UI only)
 */

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { X, Eye, Trash2 } from 'lucide-react';

import PageHeader from '../../../components/layout/PageHeader';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import FileUpload from '../../../components/ui/FileUpload';
import DropdownMenu from '../../../components/ui/DropdownMenu';
import documentIcon from '../../../assets/icons/document.svg';
import { PAST_PROJECT_ROUTES } from '../constants';

// Static mock data for UI when project doesn't have media/documents yet
const MOCK_DOCUMENTS = [
  {
    id: 'doc1',
    name: 'Final_Proposal.pdf',
    url: '#',
    size: '4.7 MB',
  },
  {
    id: 'doc2',
    name: 'Terms_Conditions.pdf',
    url: '#',
    size: '9.5 MB',
  },
  {
    id: 'doc3',
    name: 'Project_Estimate.xlsx',
    url: '#',
    size: '2.3 MB',
  },
];

const MOCK_PHOTOS = [
  {
    id: 'photo1',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
    name: 'Construction Site 1',
  },
  {
    id: 'photo2',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
    name: 'Construction Site 2',
  },
  {
    id: 'photo3',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop',
    name: 'Construction Site 3',
  },
  {
    id: 'photo4',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop',
    name: 'Building Exterior',
  },
];

const MOCK_VIDEOS = [
  {
    id: 'video1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    name: 'Project Progress Video',
  },
  {
    id: 'video2',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    name: 'Site Tour',
  },
];

// Local mock data (same structure as PastProjectDetail) - to be replaced with API
const MOCK_PAST_PROJECT_DATA = {
  '1': {
    id: '1',
    site_name: 'Shivaay Residency, Bopal',
    name: 'Shivaay Residency, Bopal',
    address: '86, Veer Nariman Road, Churchgate, Mumbai',
    profile_photo:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=400&fit=crop',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=400&fit=crop',
    documents: [
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
    ],
    photos: [
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
    ],
    videos: [],
  },
};

export default function EditPastProject() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const projectFromState = location.state?.project;
  const isAddMode = !id;

  const [project, setProject] = useState(projectFromState || null);
  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');
  const [mediaItems, setMediaItems] = useState([]); // photos + videos
  const [documentItems, setDocumentItems] = useState([]);

  // Load project (mock) and initialise form state
  useEffect(() => {
    if (!project && id) {
      const mockProject = MOCK_PAST_PROJECT_DATA[id] || null;
      setProject(mockProject);
    }
    // In add mode we don't need to load any project data
  }, [id, project, isAddMode]);

  useEffect(() => {
    if (project) {
      setProjectName(project.site_name || project.name || '');
      setAddress(project.address || '');
      // Photos + videos: use project data if present, otherwise fallback to mocks
      const hasPhotos = Array.isArray(project.photos) && project.photos.length > 0;
      const hasVideos = Array.isArray(project.videos) && project.videos.length > 0;
      const existingPhotos = hasPhotos ? project.photos : MOCK_PHOTOS;
      const existingVideos = hasVideos ? project.videos : MOCK_VIDEOS;
      setMediaItems([...existingPhotos, ...existingVideos]);

      // Documents: use project docs if present, otherwise fallback to mocks
      const hasDocuments = Array.isArray(project.documents) && project.documents.length > 0;
      setDocumentItems(hasDocuments ? project.documents : MOCK_DOCUMENTS);
    }
  }, [project]);

  const handleBack = () => {
    if (isAddMode) {
      navigate(PAST_PROJECT_ROUTES.LIST);
    } else {
      navigate(PAST_PROJECT_ROUTES.DETAILS.replace(':id', id), { state: { project } });
    }
  };

  const handleSave = () => {
    // For now just navigate back. Integrate API later.
    if (isAddMode) {
      navigate(PAST_PROJECT_ROUTES.LIST);
    } else {
      navigate(PAST_PROJECT_ROUTES.DETAILS.replace(':id', id), {
        state: {
          project: {
            ...project,
            site_name: projectName,
            name: projectName,
            address,
            photos: mediaItems,
            documents: documentItems,
          },
        },
      });
    }
  };

  const handleMediaUpload = (files) => {
    const newItems = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setMediaItems((prev) => [...prev, ...newItems]);
  };

  const handleDocumentsUpload = (files) => {
    const newDocs = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setDocumentItems((prev) => [...prev, ...newDocs]);
  };

  const handleRemoveMedia = (idToRemove) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleRemoveDocument = (idToRemove) => {
    setDocumentItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleViewDocument = (doc) => {
    if (doc.url && doc.url !== '#') {
      window.open(doc.url, '_blank');
    }
  };

  // If project not found in edit mode, show simple not-found UI
  if (!isAddMode && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary text-lg mb-2">Past project not found</p>
          <Button variant="primary" onClick={() => navigate(PAST_PROJECT_ROUTES.LIST)}>
            Back to Past Work
          </Button>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <PageHeader
          title={
            isAddMode
              ? 'Add Project (Site)'
              : projectName || project?.site_name || project?.name
          }
        />

        {/* Basic details */}
        <div className="space-y-4">
          {/* Custom label styling for Project Name */}
          <div className="space-y-1">
            <label className="text-sm text-primary-light mb-1">
              Project Name
              <span className="text-accent ml-1">*</span>
            </label>
            <Input
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          {/* Custom label styling for Address */}
          <div className="space-y-1">
            <label className="text-sm text-primary-light mb-1">
              Address
              <span className="text-accent ml-1">*</span>
            </label>
            <Input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>
        </div>

        {/* Upload Images / Videos */}
        <div className="my-6">
          <p className="text-xs text-secondary mb-2">Upload Images/Videos*</p>
          <FileUpload
            title="Upload Photos/ Videos / Documents"
            supportedFormats="JPG, PNG, MP4 (10MB each)"
            uploadButtonText="Upload"
            supportedFormatLabel="Supported Format:"
            onFileSelect={handleMediaUpload}
            accept=".jpg,.jpeg,.png,.mp4,.mov"
          />

          {/* Thumbnails row - photos & videos, matching Add New Project UI */}
          {mediaItems.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="relative w-[80px] h-[80px] rounded-xl overflow-hidden flex-shrink-0"
                >
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.name || 'Media'}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(item.id)}
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center shadow"
                  >
                    <X className="w-3 h-3 text-primary" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Documents */}
        <div className="my-6">
          <p className="text-xs text-secondary mb-2">Upload Documents</p>
          <FileUpload
            title="Upload Photos/ Videos / Documents"
            supportedFormats="PDF (10MB each)"
            uploadButtonText="Upload"
            supportedFormatLabel="Supported Format:"
            onFileSelect={handleDocumentsUpload}
            accept=".pdf"
          />

          {/* Documents list - UI same as Relevant Documents in PastProjectDocumentsGallery */}
          {documentItems.length > 0 && (
            <div className="mt-4 space-y-3">
              {documentItems.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center bg-white gap-3 p-4 rounded-xl group cursor-pointer border border-gray-200"
                  onClick={() => handleViewDocument(doc)}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <img src={documentIcon} alt="Document" className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{doc.name}</p>
                    <p className="text-xs text-primary-light ">
                      {doc.size}
                    </p>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <DropdownMenu
                      items={[
                        {
                          label: 'View Document',
                          onClick: () => handleViewDocument(doc),
                          icon: <Eye className="w-4 h-4" />,
                        },
                        {
                          label: 'Delete',
                          onClick: () => handleRemoveDocument(doc.id),
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
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 pb-10">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="px-6"
            onClick={handleBack}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="px-6"
            onClick={handleSave}
          >
            Save Project
          </Button>
        </div>
      </div>
  );
}


