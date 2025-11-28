import CircularProgress from '../../../components/ui/CircularProgress';
import DropdownMenu from '../../../components/ui/DropdownMenu';

const STATUS_PILL_COLORS = {
  completed: {
    text: '#34C759',
    border: '#34C759',
    background: 'rgba(52, 199, 89, 0.12)',
  },
  pending: {
    text: '#FF3B30',
    border: '#FF3B30',
    background: 'rgba(255, 59, 48, 0.12)',
  },
  in_progress: {
    text: '#0A84FF',
    border: '#0A84FF',
    background: 'rgba(10, 132, 255, 0.12)',
  },
  upcoming: {
    text: '#FF9500',
    border: '#FF9500',
    background: 'rgba(255, 149, 0, 0.12)',
  },
};

function ProjectStatusPill({ status }) {
  const key = status?.toLowerCase?.() || 'completed';
  const colors = STATUS_PILL_COLORS[key] || STATUS_PILL_COLORS.completed;

  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-full text-[13px] capitalize border"
      style={{
        color: colors.text,
        borderColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      {status}
    </span>
  );
}

/**
 * Single project card
 * Kept dumb/presentational so it's easy to reuse and test.
 * Updated for better responsiveness on smaller screens.
 */
export default function ProjectCard({ project, onOpenDetails, onEdit, onDelete }) {
  const imageSrc =
    project.profile_photo ||
    project.image ||
    'https://via.placeholder.com/400x300?text=Project+Image';

  const title = project.site_name || project.name || 'Untitled project';
  const address = project.address || 'No address provided';
  const status = project.status || 'Completed';
  const progress = project.progress ?? project.completion_percentage ?? 0;

  return (
    <div
      // onClick={onOpenDetails}
      className="bg-white rounded-[16px] shadow-[0px_15px_40px_rgba(18,18,18,0.06)] transition-shadow cursor-pointer"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        {/* Project Image */}
        <div className="w-full sm:w-64 flex-shrink-0 relative">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-[16px]"
          />

          {/* Circular progress over image on small screens (bottom-right) */}
          <div className="absolute bottom-1 right-1 sm:hidden ">
            <CircularProgress percentage={progress} size={45} strokeWidth={5} className='bg-white/60 rounded-full' />
          </div>
        </div>

        {/* Project Details */}
        <div className="flex-1 flex flex-col gap-2 min-h-[120px] px-0 sm:px-1.5">
          <div>
            <h3 className="text-base sm:text-lg font-medium text-primary">
              {title}
            </h3>
            <p className="mt-1 text-xs sm:text-[13px] text-[#060C1280] line-clamp-2">
              {address}
            </p>
          </div>

          {/* Status + menu in flex row */}
          <div className="mt-2 sm:mt-auto pt-1 flex items-center justify-between gap-2">
            <ProjectStatusPill status={status} />

            {/* Menu button visible on small screens here */}
            <div className="sm:hidden">
              <DropdownMenu
                position="right"
                items={[
                  {
                    label: 'Edit Project',
                    onClick: () => onEdit?.(project),
                  },
                  {
                    label: 'Delete Project',
                    onClick: () => onDelete?.(project),
                    textColor: 'text-accent',
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Progress + Menu on >= sm screens (right side) */}
        <div className="hidden sm:flex flex-shrink-0 flex-col items-end justify-between w-full sm:w-auto gap-2">
          <DropdownMenu
            position="right"
            items={[
              {
                label: 'Edit Project',
                onClick: () => onEdit?.(project),
              },
              {
                label: 'Delete Project',
                onClick: () => onDelete?.(project),
                textColor: 'text-accent',
              },
            ]}
          />

          <div className="mt-4">
            <CircularProgress percentage={progress} size={78} strokeWidth={7} />
          </div>
        </div>
      </div>
    </div>
  );
}
