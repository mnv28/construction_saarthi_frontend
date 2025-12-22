/**
 * Document Details Page
 * Shows details of a specific document (e.g., Material Quotation, Proposal)
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES_FLAT, getRoute } from '../../../constants/routes';
import PageHeader from '../../../components/layout/PageHeader';
import { X } from 'lucide-react';
import downloadIcon from '../../../assets/icons/Download Minimalistic.svg';
import aiPoweredIcon from '../../../assets/icons/Frame 2529.svg';

// Static project names mapping
const staticProjectNames = {
  '1': 'Shiv Residency, Bopal',
  '2': 'Nirmaan Homes, Surat',
  '3': 'Shivaay Homes, Rajasthan',
  '4': 'Shree Villa, Surat',
  '5': 'Shiv Residency, Bopal',
  '6': 'Nirmaan Homes, Surat',
  '7': 'Shiv Residency, Bopal',
};

// Static document data - title will be translated in component
const staticDocumentData = {
  proposal: {
    titleKey: 'details.materialQuotation',
    clientName: 'Abhishek Roy',
    contractorName: 'Shubhash rao',
    projectLocation: '86, Veer Nariman Road, Churchgate, Mumbai',
    scopeOfWork: 'Ex temporibus sed nemo. Perferendis ea iure dolor. Dolor odio et exercitationem veritatis enim exercitationem totam ab. Cumque id aperiam repellat. Impedit ea officiis velit nam. Aut quasi quam autem doloribus reiciendis est quia. Libero aperiam aut deserunt odio amet cumque consequatur repellendus voluptatem. Consequatur repudiandae illo esse. Aut mollitia qui labore eveniet illo. Odio voluptates aut voluptatem deleniti aut consectetur quis.',
    timeline: 'June 2025 - December 2026',
    paymentTerms: 'Cash',
    termsAndConditions: 'Ex temporibus sed nemo. Perferendis ea iure dolor. Dolor odio et exercitationem veritatis enim exercitationem totam ab. Cumque id aperiam repellat. Impedit ea officiis velit nam. Aut quasi quam autem doloribus reiciendis est quia. Libero aperiam aut deserunt odio amet cumque consequatur repellendus voluptatem. Consequatur repudiandae illo esse. Aut mollitia qui labore eveniet illo. Odio voluptates aut voluptatem deleniti aut consectetur quis.',
    materialEstimate: 'Ex temporibus sed nemo. Perferendis ea iure dolor. Dolor odio et exercitationem veritatis enim exercitationem totam ab. Cumque id aperiam repellat. Impedit ea officiis velit nam.',
    labourEstimate: 'Ex temporibus sed nemo. Perferendis ea iure dolor. Dolor odio et exercitationem veritatis enim exercitationem totam ab. Cumque id aperiam repellat. Impedit ea officiis velit nam. Aut quasi quam autem doloribus reiciendis est quia. Libero aperiam aut deserunt odio amet cumque consequatur repellendus voluptatem. Consequatur repudiandae illo esse. Aut mollitia qui labore eveniet illo. Odio voluptates aut voluptatem deleniti aut consectetur quis.',
  },
};

// Static past projects
const staticPastProjects = [
  {
    id: '1',
    name: 'Shivaay Residency, Bopal',
    address: 'A2b/86a, Mig Flat, Paschim Vihar, Delhi, 110087',
    phone: '01125272722',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
  },
  {
    id: '2',
    name: 'Nirmaan Homes',
    address: 'Mohan Centre Bldg, V P Road, Nr Railway Crossing, Vile Parle (west) Mumbai, Maharashtra, 400056',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
  },
];

export default function DocumentDetails() {
  const { t } = useTranslation('documents');
  const navigate = useNavigate();
  const { projectId, documentId } = useParams();
  
  const projectName = staticProjectNames[projectId] || t('project');
  const documentData = staticDocumentData[documentId] || staticDocumentData.proposal;
  const document = {
    ...documentData,
    title: t(documentData.titleKey),
  };

  const handleDownload = () => {
    // Handle download action
    console.log('Download proposal');
  };

  const handleRemoveProject = (projectId) => {
    // Handle remove project
    console.log('Remove project:', projectId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title={document.title}
        onBack={() => navigate(getRoute(ROUTES_FLAT.DOCUMENTS_PROJECT_DOCUMENTS, { projectId }))}
      >
        <div className="w-full flex justify-center md:w-auto md:justify-start">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-secondary rounded-4xl cursor-pointer whitespace-nowrap"
          >
            <img src={downloadIcon} alt="Download" className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t('details.downloadProposal')}
            </span>
          </button>
        </div>
      </PageHeader>

      <div className="mt-6 space-y-4">
        {/* Client Name */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.clientName')}
          </h3>
          <p className="text-sm text-secondary pb-4 border-b border-gray-200">{document.clientName}</p>
        </div>

        {/* Contractor Name */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.contractorName')}
          </h3>
          <p className="text-sm text-secondary pb-4 border-b border-gray-200">{document.contractorName}</p>
        </div>

        {/* Project Location */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.projectLocation')}
          </h3>
          <p className="text-sm text-secondary pb-4 border-b border-gray-200">{document.projectLocation}</p>
        </div>

        {/* Scope of Work */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.scopeOfWork')}
          </h3>
          <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
            <p className="text-sm text-secondary whitespace-pre-line flex-1">{document.scopeOfWork}</p>
            <div className="flex-shrink-0 pt-2">
              <img src={aiPoweredIcon} alt="AI Powered" className="h-9" />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.timeline')}
          </h3>
          <p className="text-sm text-secondary pb-4 border-b border-gray-200">{document.timeline}</p>
        </div>

        {/* Payment Terms */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.paymentTerms')}
          </h3>
          <p className="text-sm text-secondary pb-4 border-b border-gray-200">{document.paymentTerms}</p>
        </div>

        {/* Terms and Conditions */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.termsAndConditions')}
          </h3>
          <p className="text-sm text-secondary whitespace-pre-line pb-4 border-b border-gray-200">{document.termsAndConditions}</p>
        </div>

        {/* Material Estimate */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.materialEstimate')}
          </h3>
          <p className="text-sm text-secondary whitespace-pre-line pb-4 border-b border-gray-200">{document.materialEstimate}</p>
        </div>

        {/* Labour Estimate */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-2">
            {t('details.labourEstimate')}
          </h3>
          <p className="text-sm text-secondary whitespace-pre-line pb-4 border-b border-gray-200">{document.labourEstimate}</p>
        </div>

        {/* Past Projects */}
        <div>
          <h3 className="text-sm font-semibold text-primary mb-4">
            {t('details.pastProjects')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staticPastProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 p-4 relative"
              >
                <button
                  onClick={() => handleRemoveProject(project.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-secondary" />
                </button>
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-primary mb-1">
                      {project.name}
                    </h4>
                    <p className="text-xs text-secondary mb-1 line-clamp-2">
                      {project.address}
                    </p>
                    {project.phone && (
                      <p className="text-xs text-secondary">{project.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

