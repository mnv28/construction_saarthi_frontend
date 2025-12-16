import { useState } from 'react';

/**
 * Past Project Card Component
 * Simple card with image on left and details on right
 * Fully responsive and dynamic
 */
export default function PastProjectCard({ project, onOpenDetails }) {
  const [imageError, setImageError] = useState(false);
  
  const defaultImage = 'https://via.placeholder.com/400x300?text=Past+Project+Image';
  const imageSrc =
    imageError
      ? defaultImage
      : project.profile_photo ||
        project.image ||
        defaultImage;

  const title = project.site_name || project.name || 'Untitled project';
  const address = project.address || 'No address provided';

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      onClick={onOpenDetails}
      className="bg-white rounded-[16px] shadow-[0px_15px_40px_rgba(18,18,18,0.06)] transition-shadow cursor-pointer overflow-hidden p-4"
    >
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Project Image - Left Side */}
        <div className="w-full md:w-[180px] lg:w-[180px] flex-shrink-0">
          <img
            src={imageSrc}
            alt={title}
            onError={handleImageError}
            className="w-full h-48 sm:h-full sm:min-h-[140px] object-cover rounded-lg"
          />
        </div>

        {/* Project Details - Right Side */}
        <div className="flex-1 flex flex-col justify-center px-3.5">
          <h3 className="text-[20px] font-medium text-primary mb-2 sm:mb-3">
            {title}
          </h3>
          <p className="text-primary-light leading-relaxed">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
}

