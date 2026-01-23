import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES_FLAT, getRoute } from '../../../constants/routes';
import PageHeader from '../../../components/layout/PageHeader';
import Loader from '../../../components/ui/Loader';
import aiPoweredIcon from '../../../assets/icons/aipowered.svg';
import { getProjectDocuments } from '../../projects/api';

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

export default function ProjectDocuments() {
  const { t } = useTranslation('documents');
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const projectName = staticProjectNames[projectId] || t('project');

  const handleDocumentClick = (documentId) => {
    navigate(getRoute(ROUTES_FLAT.DOCUMENTS_DOCUMENT_DETAILS, { projectId, documentId }));
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);
        const data = await getProjectDocuments(projectId);
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching project documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [projectId]);

  return (
    <div className="max-w-7xl mx-auto relative">
      <PageHeader
        title={projectName}
        onBack={() => navigate(ROUTES_FLAT.DOCUMENTS)}
      />

      {/* AI Powered Badge - Fixed on right side */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10 block">
        <img src={aiPoweredIcon} alt="AI Powered" className="h-9 cursor-pointer" />
      </div>

      {/* Documents List */}
      <div className="space-y-4 mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : documents.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-secondary">{t('noDocumentsFound', { defaultValue: 'No documents found' })}</p>
          </div>
        ) : (
          documents.map((document) => (
            <div
              key={document.id}
              onClick={() => handleDocumentClick(document.id)}
              className="bg-white rounded-xl p-4 border border-gray-100 flex items-start gap-3 relative cursor-pointer shadow-sm"
            >
              {/* Red vertical bar - Vector element */}
              <div className="w-1 h-8 bg-accent rounded-full absolute left-0 top-1/2 -translate-y-1/2"></div>
              <div className="flex-1 pl-3">
                <h4 className="text-sm sm:text-base font-semibold text-primary mb-1">
                  {document.title}
                </h4>
                <p className="text-xs sm:text-sm text-secondary">
                  {document.prompt_title}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

