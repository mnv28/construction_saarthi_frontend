import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreVertical, Play } from 'lucide-react';
import DropdownMenu from '../../../components/ui/DropdownMenu';

export default function VideoCard({ video, onPlay, onDelete }) {
  const { t } = useTranslation('projectGallery');
  const [imageError, setImageError] = useState(false);

  // Extract video name from URL
  const getVideoName = () => {
    if (video.name) return video.name;
    if (video.fileName) return video.fileName;
    if (video.url) {
      const urlParts = video.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return fileName.split('?')[0] || 'Video';
    }
    return 'Video';
  };

  // Format date (e.g., "12 May 2025")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get thumbnail URL (if available) or use video URL as fallback
  const getThumbnailUrl = () => {
    if (imageError) return null;
    return video.thumbnail || video.thumbnailUrl || video.url || null;
  };

  const videoName = getVideoName();
  const date = formatDate(video.createdAt || video.date);
  const thumbnailUrl = getThumbnailUrl();

  const menuItems = [
    ...(onDelete ? [{
      label: t('actions.delete', { defaultValue: 'Delete' }),
      onClick: () => {
        if (onDelete) onDelete(video);
      },
      textColor: 'text-red-600',
    }] : []),
  ];

  return (
    <div className="relative group cursor-pointer" onClick={() => onPlay?.(video) || (video.url && window.open(video.url, '_blank'))}>
      {/* Video Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
        {/* Video Thumbnail or Video Element */}
        {thumbnailUrl && !thumbnailUrl.match(/\.(mp4|mov|avi|mkv|webm)$/i) ? (
          <img
            src={thumbnailUrl}
            alt={videoName}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={video.url}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
            playsInline
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-200');
            }}
          />
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Video Type Badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white uppercase tracking-wide z-10 pointer-events-none">
          {videoName?.split('.').pop() || 'VIDEO'}
        </div>

        {/* Options Menu - Only show if there are menu items */}
        {menuItems.length > 0 && (
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DropdownMenu
              items={menuItems}
              position="right"
              trigger={
                <button className="p-2 cursor-pointer">
                  <MoreVertical className="w-4 h-4 text-secondary" />
                </button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

