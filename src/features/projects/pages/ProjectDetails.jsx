/**
 * Project Details Page
 * Displays detailed information about a specific project
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, MoreVertical, User, Phone, Building } from 'lucide-react';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/StatusBadge';
import CircularProgress from '../../../components/ui/CircularProgress';
import DropdownMenu from '../../../components/ui/DropdownMenu';
import { getProjectDetails } from '../api';
import { PROJECT_ROUTES } from '../constants';
import { showError } from '../../../utils/toast';

// Site Management Tools
const SITE_MANAGEMENT_TOOLS = [
  {
    id: 'finance',
    label: 'Manage Finance',
    icon: '₹',
    hasAlert: false,
  },
  {
    id: 'calculator',
    label: 'Construction Calculator',
    icon: '🧮',
    hasAlert: true,
  },
  {
    id: 'inventory',
    label: 'Site Inventory',
    icon: '📋',
    hasAlert: true,
  },
  {
    id: 'documents',
    label: 'Generate Documents',
    icon: '📄',
    hasAlert: true,
  },
  {
    id: 'labour',
    label: 'Labour Sheet',
    icon: '👥',
    hasAlert: false,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: '🖼️',
    hasAlert: false,
  },
  {
    id: 'dpr',
    label: 'Daily Progress Report (DPR)',
    icon: '📊',
    hasAlert: false,
  },
  {
    id: 'notes',
    label: 'Add Notes',
    icon: '🎤',
    hasAlert: true,
  },
];

// Status badge color mapping
const getStatusColor = (status) => {
  const statusMap = {
    completed: 'green',
    pending: 'pink',
    in_progress: 'blue',
    upcoming: 'yellow',
  };
  return statusMap[status?.toLowerCase()] || 'green';
};

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getProjectDetails(id);
      setProject(response?.data || response);
    } catch (error) {
      console.error('Error fetching project details:', error);
      showError('Failed to load project details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(PROJECT_ROUTES.PROJECTS);
  };

  const handleEdit = () => {
    navigate(PROJECT_ROUTES.EDIT_PROJECT.replace(':id', id));
  };

  const handleToolClick = (toolId) => {
    // TODO: Navigate to specific tool pages
    console.log('Tool clicked:', toolId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-secondary">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary text-lg mb-2">Project not found</p>
          <Button variant="primary" onClick={handleBack}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const description = project.description || project.project_description || '';
  const truncatedDescription = description.length > 200 ? description.substring(0, 200) + '...' : description;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#E8F4FD] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-primary">
              {project.site_name || project.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleEdit}
              leftIconName="Edit"
            >
              Edit Project
            </Button>
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu
                items={[
                  {
                    label: 'Delete Project',
                    onClick: () => {
                      // TODO: Implement delete with confirmation
                      console.log('Delete project:', id);
                    },
                    textColor: 'text-red-600',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Project Overview Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Project Image */}
          <div className="w-full h-64 sm:h-80 lg:h-96">
            <img
              src={project.profile_photo || project.image || 'https://via.placeholder.com/1200x400?text=Project+Image'}
              alt={project.site_name || project.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Project Info */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                  {project.site_name || project.name}
                </h2>
                <p className="text-secondary mb-3">
                  {project.address || 'No address provided'}
                </p>
                <StatusBadge
                  text={project.status || 'Completed'}
                  color={getStatusColor(project.status)}
                />
              </div>
              <div className="flex-shrink-0">
                <CircularProgress
                  percentage={project.progress || project.completion_percentage || 0}
                  size={120}
                  strokeWidth={8}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Site Management Tools Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-primary mb-6">Site Management Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SITE_MANAGEMENT_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-2xl group-hover:bg-accent/20 transition-colors">
                    {tool.icon}
                  </div>
                  {tool.hasAlert && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-primary text-center">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Builder / Client Information Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-primary mb-4">Builder / Client Information</h3>
          <div className="space-y-3">
            {project.builder_name && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-secondary" />
                <span className="text-primary">{project.builder_name}</span>
              </div>
            )}
            {project.contact_number && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-primary">{project.contact_number}</span>
              </div>
            )}
            {project.builder_company && (
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-secondary" />
                <span className="text-primary">{project.builder_company}</span>
              </div>
            )}
            {!project.builder_name && !project.contact_number && !project.builder_company && (
              <p className="text-secondary">No builder/client information available</p>
            )}
          </div>
        </div>

        {/* Project Information Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-primary mb-4">Project Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.start_date && project.completion_date && (
              <div>
                <span className="text-secondary text-sm">Project Duration:</span>
                <p className="text-primary font-medium">
                  {new Date(project.start_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })} - {new Date(project.completion_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
            {project.size && (
              <div>
                <span className="text-secondary text-sm">Size:</span>
                <p className="text-primary font-medium">{project.size} sq.ft</p>
              </div>
            )}
            {project.no_of_floors && (
              <div>
                <span className="text-secondary text-sm">No. of Floors:</span>
                <p className="text-primary font-medium">{project.no_of_floors}</p>
              </div>
            )}
            {project.construction_type && (
              <div>
                <span className="text-secondary text-sm">Construction Type:</span>
                <p className="text-primary font-medium">{project.construction_type}</p>
              </div>
            )}
            {project.contract_type && (
              <div>
                <span className="text-secondary text-sm">Contract Type:</span>
                <p className="text-primary font-medium">{project.contract_type}</p>
              </div>
            )}
            {project.estimated_budget && (
              <div>
                <span className="text-secondary text-sm">Est. Budget:</span>
                <p className="text-primary font-medium">₹{project.estimated_budget}</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Description Section */}
        {description && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Project Description</h3>
            <p className="text-secondary leading-relaxed">
              {showFullDescription ? description : truncatedDescription}
            </p>
            {description.length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-accent font-medium mt-2 hover:underline cursor-pointer"
              >
                {showFullDescription ? 'read less' : 'read more'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

