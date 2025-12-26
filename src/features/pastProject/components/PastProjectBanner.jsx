/**
 * Past Project Banner Component
 * Reusable component for displaying past project banner with image, title, and address
 * Adapted from ProjectBanner but without progress/status for past projects
 */

import { useTranslation } from 'react-i18next';

export default function PastProjectBanner({ project }) {
  const { t } = useTranslation('pastProjects');
  const imageSrc = project.profile_photo || project.image || 'https://via.placeholder.com/1200x400?text=Past+Project+Image';
  const title = project.site_name || project.name || t('untitled', { defaultValue: 'Untitled Project' });
  const address = project.address || t('detail.noAddressProvided', { defaultValue: 'No address provided' });

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Project Image */}
      <div className="w-full h-[220px] relative">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Project Info */}
      <div className="p-5">
        <div className="flex flex-col">
          <h2 className="text-lg sm:text-[22px] font-bold text-primary">
            {title}
          </h2>
          <p className="text-secondary text-sm sm:text-base">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
}

