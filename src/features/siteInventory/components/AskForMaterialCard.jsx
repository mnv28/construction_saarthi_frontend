/**
 * AskForMaterialCard Component
 * Displays a single "Ask for Materials" request with status and rejection reason
 */

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function AskForMaterialCard({
  request,
  t,
  formatTime,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Map backend response fields to UI-friendly variables
  const status = request.status;

  // Quantity / title content
  const quantity = request.item_count ?? request.quantity ?? 0;
  const materialName =
    request.materialName ||
    request.material?.name ||
    ''; // backend currently doesn't send name, so this may be empty

  // "From: <project>" text
  const fromProjectId =
    request.whichProject ||
    request.fromProject ||
    request.from_project ||
    request.fromProjectId;
  const fromProjectName =
    request.fromProjectName ||
    request.from_project_name ||
    (fromProjectId ? `Project ${fromProjectId}` : '');
  const hasFromProject = !!fromProjectName;

  // Asking description line (grey text)
  const askingDescription =
    request.asking_description || request.description || '';

  // Timestamps
  const timestamp = request.createdAt || request.updatedAt || request.timestamp;

  // Rejection info
  const rejectionReason =
    request.rejected_description || request.rejectionReason || '';
  const rejectionAudio =
    request.rejection_audio_url || request.rejectionAudio || null;

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  const getStatusBadge = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-lg border border-[rgba(52,199,89,0.4)] bg-[rgba(52,199,89,0.08)] text-[#34C759]">
            {t('askForMaterials.status.approved', { defaultValue: 'Approved' })}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-lg border border-[rgba(255,59,48,0.4)] bg-[rgba(255,59,48,0.08)] text-[#FF3B30]">
            {t('askForMaterials.status.rejected', { defaultValue: 'Rejected' })}
          </span>
        );
      case 'pending':
        return (
          <StatusBadge
            text={t('askForMaterials.status.pending', { defaultValue: 'Pending' })}
            color="yellow"
            className="text-xs px-2 py-1"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-base sm:text-lg text-primary">
              {quantity}{' '}
              {materialName ||
                t('askForMaterials.items', { defaultValue: 'items' })}
            </h3>
            {hasFromProject && (
              <span className="text-base sm:text-lg">
                {t('askForMaterials.from', { defaultValue: 'From:' })}{' '}
                {fromProjectName}
              </span>
            )}
          </div>
          {askingDescription && (
            <p className="text-base text-secondary">{askingDescription}</p>
          )}
        </div>
        
        {/* Status Badge and Timestamp */}
        <div className="flex items-center gap-2 sm:gap-3">
          {getStatusBadge()}
          <span className="text-xs sm:text-sm text-secondary whitespace-nowrap">
            {formatTime(timestamp)}
          </span>
        </div>
      </div>

      {/* Rejection Reason Section - Only show for rejected requests */}
      {status === 'rejected' && (rejectionReason || rejectionAudio) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-primary mb-3">
            {t('askForMaterials.rejectionReason', { defaultValue: 'Reason for rejection' })}
          </p>
          
          <div className="space-y-3">
            {/* Audio Player */}
            {rejectionAudio && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg w-fit">
                <button
                  onClick={toggleAudio}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-[#9F290A] transition-colors cursor-pointer"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                  )}
                </button>
                <div className="flex-1 min-w-[200px]">
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '30%' }}></div>
                  </div>
                  <p className="text-xs text-secondary mt-1">00:12</p>
                </div>
              </div>
            )}
            
            {/* Text Reason */}
            {rejectionReason && (
              <p className="text-sm">
                {rejectionReason}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

