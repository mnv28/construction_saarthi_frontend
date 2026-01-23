import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES_FLAT, getRoute } from '../../../constants/routes';
import PageHeader from '../../../components/layout/PageHeader';
import SearchBar from '../../../components/ui/SearchBar';
import Dropdown from '../../../components/ui/Dropdown';
import Loader from '../../../components/ui/Loader';
import aiPoweredIcon from '../../../assets/icons/aipowered.svg';
import { getAllProjects } from '../../projects/api/projectApi';
import { useAuth } from '../../auth/store';
import { showError } from '../../../utils/toast';

export default function GenerateDocuments() {
  const { t } = useTranslation('documents');
  const navigate = useNavigate();
  const { selectedWorkspace } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const isFetchingRef = useRef(false);
  const [imageErrors, setImageErrors] = useState({});

  const statusOptions = [
    { value: '', label: t('all', { defaultValue: 'All' }) },
    { value: 'completed', label: t('completed', { defaultValue: 'Completed' }) },
    { value: 'in_progress', label: t('inProgress', { defaultValue: 'In Progress' }) },
  ];

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedWorkspace) {
        setProjects([]);
        return;
      }

      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsLoadingProjects(true);
        const response = await getAllProjects(selectedWorkspace);

        const transformedProjects = response.map((project) => {
          const details = project.details || {};

          const getImageUrl = (media) => {
            if (!media) return null;
            if (typeof media === 'string') return media;
            if (Array.isArray(media) && media.length > 0) {
              return typeof media[0] === 'string' ? media[0] : media[0]?.url;
            }
            if (typeof media === 'object' && media.url) return media.url;
            return null;
          };

          // Format budget
          let budgetFormatted = '₹0';
          const budgetValue = details.estimatedBudget || project.estimatedBudget || project.budget;
          if (budgetValue) {
            if (typeof budgetValue === 'string') {
              budgetFormatted = budgetValue;
            } else if (typeof budgetValue === 'number') {
              if (budgetValue >= 10000000) {
                budgetFormatted = `₹${(budgetValue / 10000000).toFixed(1)}Cr`;
              } else if (budgetValue >= 100000) {
                budgetFormatted = `₹${(budgetValue / 100000).toFixed(1)}L`;
              } else {
                budgetFormatted = `₹${budgetValue.toLocaleString()}`;
              }
            }
          }

          // Format balance
          let balanceFormatted = '₹0';
          const balanceValue = project.balance || details.balance;
          if (balanceValue) {
            if (typeof balanceValue === 'string') {
              balanceFormatted = balanceValue;
            } else if (typeof balanceValue === 'number') {
              if (balanceValue >= 100000) {
                balanceFormatted = `₹${(balanceValue / 100000).toFixed(1)}L`;
              } else {
                balanceFormatted = `₹${balanceValue.toLocaleString()}`;
              }
            }
          }

          return {
            id: project.id || project.project_id,
            name: project.name || details.name || 'Untitled Project',
            address: details.address || project.address || '',
            image: getImageUrl(project.profilePhoto) || getImageUrl(details.profilePhoto) || null,
            status: project.status || details.status || 'in_progress',
            budget: budgetFormatted,
            balance: balanceFormatted,
          };
        });

        setProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        showError(t('error.fetchProjects', { defaultValue: 'Failed to load projects' }));
      } finally {
        setIsLoadingProjects(false);
        isFetchingRef.current = false;
      }
    };

    fetchProjects();
  }, [selectedWorkspace, t]);

  const handleProjectClick = (projectId, projectName) => {
    navigate(getRoute(ROUTES_FLAT.DOCUMENTS_PROJECT_DOCUMENTS, { projectId }), {
      state: { projectName }
    });
  };

  const handleImageError = (projectId) => {
    setImageErrors((prev) => ({ ...prev, [projectId]: true }));
  };

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !searchQuery ||
        (project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.address?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        !statusFilter ||
        (project.status || '').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto relative">
      <PageHeader
        title={t('generateDocuments')}
        onBack={() => navigate(-1)}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 md:gap-4">
          <SearchBar
            placeholder={t('searchProjects')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:flex-1 lg:w-[300px] lg:flex-none sm:min-w-0"
          />
          <Dropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder={t('status')}
            className="w-full sm:w-36 md:w-40 flex-shrink-0"
          />
        </div>
      </PageHeader>

      {/* AI Powered Badge - Fixed on right side */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10 block">
        <img src={aiPoweredIcon} alt="AI Powered" className="h-9 cursor-pointer" />
      </div>

      {/* Projects List */}
      <div>
        {isLoadingProjects ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-sm sm:text-base text-secondary">
              {t('noProjectsFound')}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredProjects.map((project) => {
              const hasImageError = imageErrors[project.id];
              const imageSrc = project.image;
              const showImage = imageSrc && !hasImageError;

              return (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id, project.name)}
                  className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer shadow-md"
                >
                  {/* Project Image - Same as Daily Progress Report */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {showImage ? (
                      <img
                        src={imageSrc}
                        alt={project.name}
                        onError={() => handleImageError(project.id)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F3F4F6] text-xs text-[#060C1280]">
                        {t('noImage')}
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-primary mb-1 truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary mb-2 sm:mb-7 line-clamp-1">
                      {project.address}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="text-secondary">
                        {t('budget')}: <span className="font-medium text-primary">{project.budget}</span>
                      </span>
                      <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
                      <span className="text-secondary">
                        {t('balance')}: <span className="font-medium text-primary">{project.balance}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
