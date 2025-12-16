/**
 * Past Work Page
 * Displays all past projects with search, filter, and project cards
 * Fully responsive and dynamic design
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBar from '../../../components/ui/SearchBar';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import EmptyState from '../../../components/shared/EmptyState';
import EmptyStateSvg from '../../../assets/icons/EmptyState.svg';
import { PastProjectCard } from '../components';
import { PAST_PROJECT_ROUTES } from '../constants';
import { Plus } from 'lucide-react';

// Static mock data for UI development
const MOCK_PAST_PROJECTS = [
  {
    id: '1',
    site_name: 'Shivaay Residency',
    name: 'Shivaay Residency',
    address: 'Bopal, Ahmedabad, Gujarat 380058',
    status: 'Completed',
    progress: 100,
    completion_percentage: 100,
    profile_photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    site_name: 'Green Valley Apartments',
    name: 'Green Valley Apartments',
    address: 'Sector 5, Gandhinagar, Gujarat 382010',
    status: 'Completed',
    progress: 100,
    completion_percentage: 100,
    profile_photo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    site_name: 'Royal Heights',
    name: 'Royal Heights',
    address: 'Vastrapur, Ahmedabad, Gujarat 380015',
    status: 'Completed',
    progress: 100,
    completion_percentage: 100,
    profile_photo: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    site_name: 'Sunrise Towers',
    name: 'Sunrise Towers',
    address: 'Satellite, Ahmedabad, Gujarat 380015',
    status: 'Completed',
    progress: 100,
    completion_percentage: 100,
    profile_photo: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    site_name: 'Prestige Gardens',
    name: 'Prestige Gardens',
    address: 'Maninagar, Ahmedabad, Gujarat 380008',
    status: 'Completed',
    progress: 100,
    completion_percentage: 100,
    profile_photo: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    site_name: 'Elite Residency Complex',
    name: 'Elite Residency Complex',
    address: 'Navrangpura, Ahmedabad, Gujarat 380009',
    status: 'Completed',
    progress: 100,
    completion_percentage: 100,
    profile_photo: 'https://images.unsplash.com/photo-1600585152915-d0bec72a0e0b?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1600585152915-d0bec72a0e0b?w=400&h=300&fit=crop',
  },
];

export default function PastWork() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  
  // Static mock data - will be replaced with API hook later
  // For now, start with an empty list so the empty-state UI is visible while testing
  const [pastProjects] = useState([]);
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Filter projects based on search query - fully dynamic and responsive
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return pastProjects;
    }
    
    const searchLower = searchQuery.toLowerCase().trim();
    return pastProjects.filter((project) => {
      const title = (project.site_name || project.name || '').toLowerCase();
      const address = (project.address || '').toLowerCase();
      return title.includes(searchLower) || address.includes(searchLower);
    });
  }, [pastProjects, searchQuery]);

  const handleProjectClick = (project) => {
    navigate(PAST_PROJECT_ROUTES.DETAILS.replace(':id', project.id), {
      state: { project },
    });
  };

  const handleEditProject = (project) => {
    // TODO: Navigate to edit page when route is set up
    console.log('Edit project:', project);
  };

  const handleRequestDelete = (project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement actual delete API call when integrating with API
    // For now, just close the modal (static data won't be deleted)
    if (projectToDelete) {
      // In real implementation: await deletePastProject(projectToDelete.id);
      // setPastProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setProjectToDelete(null);
  };

  const handleSort = () => {
    // TODO: Implement sort functionality
    console.log('Sort clicked');
  };

  return (
      <div className="max-w-7xl mx-auto px-0 md:px-4">
        {/* Header Section - Title on left, Search and Button on right */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            {/* Title - Left Side */}
            <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-primary">
              {t('sidebar.mainMenu.pastWork', { defaultValue: 'My Past Work' })}
            </h1>

            {/* Search and Button - Right Side */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              {/* Search Bar */}
              <SearchBar
                placeholder={t('pastWork.searchProjects', { defaultValue: 'Search Projects' })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[200px] md:w-[240px] lg:w-[280px] flex-shrink-0"
              />

              {/* Add Project Button - hide in empty-state view */}
              {pastProjects.length > 0 && (
                <button
                  onClick={() => {
                    navigate(PAST_PROJECT_ROUTES.ADD_NEW);
                  }}
                  className="w-full sm:w-auto whitespace-nowrap text-sm sm:text-base text-accent flex font-medium cursor-pointer"
                >
                  {/* <Plus className="text-white bg-accent rounded-full font-bold" strokeWidth={1.5} /> */}
                  <span className="text-white bg-accent rounded-full font-bold w-6 mr-2">+</span>
                  {t('pastWork.addProjectSite', { defaultValue: 'Add Project (Site)' })}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Past Projects List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : filteredProjects.length === 0 ? (
          searchQuery ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-secondary text-base sm:text-lg mb-2">
                  {t('pastWork.noResults', { defaultValue: 'No past projects found' })}
                </p>
                <p className="text-secondary text-sm sm:text-base">
                  {t('pastWork.adjustSearch', { defaultValue: 'Try adjusting your search' })}
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              image={EmptyStateSvg}
              title={t('pastWork.emptyState.title', { defaultValue: 'No Project Added' })}
              message={t('pastWork.emptyState.message', { defaultValue: 'Add your projects to show in your proposal' })}
              actionLabel={t('pastWork.addProjectSite', { defaultValue: 'Add Project (Site)' })}
              onAction={() => {
                navigate(PAST_PROJECT_ROUTES.ADD_NEW);
              }}
            />
          )
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <PastProjectCard
                  key={project.id}
                  project={project}
                  onOpenDetails={() => handleProjectClick(project)}
                />
              ))}
            </div>

            {/* Delete confirmation modal */}
            <ConfirmModal
              isOpen={!!projectToDelete}
              onClose={handleCloseDeleteModal}
              onConfirm={handleConfirmDelete}
              title={t('pastWork.deleteTitle', { defaultValue: 'Delete Past Project' })}
              maxWidthClass="max-w-xl"
              message={
                projectToDelete ? (
                  <p>
                    {t('pastWork.deleteMessage', { defaultValue: 'Are you sure you want to delete' })}{' '}
                    <span className="font-medium text-primary">
                      {projectToDelete.site_name || projectToDelete.name}
                    </span>
                    {' '}?
                  </p>
                ) : (
                  ''
                )
              }
              confirmText={t('confirm')}
              cancelText={t('cancel')}
              confirmVariant="primary"
            />
          </>
        )}
      </div>
  );
}

