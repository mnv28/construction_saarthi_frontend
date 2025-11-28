/**
 * Projects List Page
 * Displays all projects with search, filter, and project cards
 * Uses feature API + shared UI components for a human-friendly, maintainable structure.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/ui/SearchBar';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import Loader from '../../../components/ui/Loader';
import { ProjectCard } from '../components';
import { PROJECT_ROUTES } from '../constants';
import { useDebounce } from '../../../hooks/useDebounce';
import { ChevronDown } from "lucide-react";

// Temporary static data for UI testing.
// TODO: Replace with API response (getProjects) once backend is wired.
const MOCK_PROJECTS = [
  {
    id: '1',
    site_name: 'Shivaay Residency, Bopal',
    address: '86, Veer Nariman Road, Churchgate, Mumbai',
    status: 'completed',
    progress: 79,
    profile_photo:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    site_name: 'Nirmaan Homes, Adajan',
    address: '86, Veer Nariman Road, Churchgate, Mumbai',
    status: 'pending',
    progress: 10,
    profile_photo:
      'https://images.unsplash.com/photo-1459535653751-d571815e906b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    site_name: 'Shree Villa',
    address: '86, Veer Nariman Road, Churchgate, Mumbai',
    status: 'completed',
    progress: 50,
    profile_photo:
      'https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    site_name: 'Shivaay Residency, Bopal',
    address: '86, Veer Nariman Road, Churchgate, Mumbai',
    status: 'completed',
    progress: 75,
    profile_photo:
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80',
  },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  // { value: 'pending', label: 'Pending' },
];

export default function Projects() {
  const navigate = useNavigate();
  const [projects] = useState(MOCK_PROJECTS);
  const [filteredProjects, setFilteredProjects] = useState(MOCK_PROJECTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      const search = debouncedSearch.trim().toLowerCase();
      const status = statusFilter.trim().toLowerCase();

      const results = projects.filter((project) => {
        const projectStatus = (project.status || '').toLowerCase();
        const matchesStatus = !status || projectStatus === status;

        if (!matchesStatus) return false;

        if (!search) return true;

        const target =
          `${project.site_name || project.name || ''} ${project.address || ''}`.toLowerCase();

        return target.includes(search);
      });

      setFilteredProjects(results);
      setIsLoading(false);
    }, 200); // small delay to mimic API loading and leverage debounce

    return () => clearTimeout(timeout);
  }, [debouncedSearch, statusFilter, projects]);

  const handleAddNewProject = () => {
    navigate(PROJECT_ROUTES.ADD_NEW_PROJECT);
  };

  const handleProjectClick = (projectId) => {
    navigate(PROJECT_ROUTES.PROJECT_DETAILS.replace(':id', projectId));
  };

  const handleEditProject = (project) => {
    navigate(PROJECT_ROUTES.EDIT_PROJECT.replace(':id', project.id));
  };

  const handleRequestDelete = (project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = () => {
    // For now, just close modal and filter from local list (static data)
    if (projectToDelete) {
      setFilteredProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setProjectToDelete(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-0 md:px-4 md:py-7 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:flex-wrap lg:items-center">
            <h1 className="!text-[22px] font-semibold text-primary">
              Projects
            </h1>

            {/* Actions: search, filter, button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 w-full md:max-w-3xl lg:w-auto">
              <SearchBar
                placeholder="Search Projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:flex-1 lg:max-w-[260px]"
              />

              <Dropdown
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Status"
                className="w-full sm:w-[140px] sm:flex-shrink-0"
                showSeparator={false}    
                onAddNew={null}          
                addButtonLabel=""         

                customButton={(isOpen, setIsOpen, selectedOption) => (
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full sm:w-[140px] py-3 px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-sm flex items-center justify-between cursor-pointer"
                  >
                    {/* Title */}
                    <span className="text-primary">{selectedOption?.label || "Status"}</span>

                    {/* Chevron Down */}
                    <ChevronDown
                      className={`w-4 h-4 text-primary transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                )}
              />

              <Button
                variant="primary"
                size="md"
                onClick={handleAddNewProject}
                leftIconName="Plus"
                iconSize="w-3 h-3 text-accent"
                className="w-full sm:w-auto whitespace-nowrap rounded-lg py-2.5"
              >
                Add New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-secondary text-lg mb-2">No projects found</p>
              <p className="text-secondary text-sm">
                {searchQuery || statusFilter
                  ? 'Try adjusting your search or filter'
                  : 'Get started by adding your first project'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpenDetails={() => handleProjectClick(project.id)}
                  onEdit={handleEditProject}
                  onDelete={handleRequestDelete}
                />
              ))}
            </div>

            {/* Delete confirmation modal */}
            <ConfirmModal
              isOpen={!!projectToDelete}
              onClose={handleCloseDeleteModal}
              onConfirm={handleConfirmDelete}
              title="Delete Project"
              maxWidthClass="max-w-xl"
              message={
                projectToDelete ? (
                  <p>
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-primary">
                      {projectToDelete.site_name || projectToDelete.name}
                    </span>{' '}
                    project from this workspace? This action is irreversible, and your data cannot
                    be recovered.
                  </p>
                ) : (
                  ''
                )
              }
              confirmText="Yes, Delete"
              cancelText="Cancel"
              confirmVariant="primary"
            />
          </>
        )}
      </div>
    </div>
  );
}

