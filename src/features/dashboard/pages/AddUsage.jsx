import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import PageHeader from '../../../components/layout/PageHeader';
import Dropdown from '../../../components/ui/Dropdown';
import Radio from '../../../components/ui/Radio';
import Input from '../../../components/ui/Input';
import RichTextEditor from '../../../components/ui/RichTextEditor';
import { getAllProjects } from '../../projects/api/projectApi';
import { useAuth } from '../../auth/store';
import Button from '../../../components/ui/Button';


export default function AddUsage() {
    const { t } = useTranslation(['dashboard', 'common']);
    const navigate = useNavigate();
    const { selectedWorkspace } = useAuth();

    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    const [formData, setFormData] = useState({
        projectId: '',
        materialType: 'consumable',
        materialSearch: '',
        quantity: '',
        unit: 'Bags',
        description: ''
    });

    useEffect(() => {
        const fetchProjects = async () => {
            if (!selectedWorkspace) return;
            try {
                setIsLoadingProjects(true);
                const data = await getAllProjects(selectedWorkspace);
                const projectOptions = data.map(p => ({
                    value: p.id || p.project_id,
                    label: p.name || p.details?.name || 'Untitled Project'
                }));
                setProjects(projectOptions);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setIsLoadingProjects(false);
            }
        };
        fetchProjects();
    }, [selectedWorkspace]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSubmit = () => {
        console.log('Form Submitted:', formData);
        navigate(-1);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen flex flex-col">
            <div className="flex-1 px-4 sm:px-6 pb-24">
                <PageHeader
                    title={t('addUsagePage.title', { defaultValue: 'Add Usage' })}
                    onBack={() => navigate(-1)}
                />

                <div className="mt-8 space-y-5">
                    {/* Project Selection */}
                    <div className="space-y-2">
                        <Dropdown
                            label={t('addUsagePage.projectSite', { defaultValue: 'Project (Site)' })}
                            required
                            options={projects}
                            value={formData.projectId}
                            onChange={(val) => handleChange('projectId', val)}
                            placeholder={t('addUsagePage.selectProject', { defaultValue: 'Select Project' })}
                            disabled={isLoadingProjects}
                            className=""
                        />
                    </div>

                    {/* Material Type */}
                    <div className="space-y-4">
                        <span className="block text-primary font-medium">
                            {t('addUsagePage.materialType', { defaultValue: 'Material Type' })}
                        </span>
                        <div className="flex items-center gap-10">
                            <Radio
                                label={t('addUsagePage.reusable', { defaultValue: 'Reusable' })}
                                name="materialType"
                                value="reusable"
                                checked={formData.materialType === 'reusable'}
                                onChange={() => handleChange('materialType', 'reusable')}
                                className="font-medium"
                            />
                            <Radio
                                label={t('addUsagePage.consumable', { defaultValue: 'Consumable' })}
                                name="materialType"
                                value="consumable"
                                checked={formData.materialType === 'consumable'}
                                onChange={() => handleChange('materialType', 'consumable')}
                                className="font-medium"
                            />
                        </div>
                    </div>

                    {/* Material Search */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                            <Search className="w-5 h-5 text-[#060C1280]" />
                        </div>
                        <Input
                            placeholder={t('addUsagePage.materialPlaceholder', { defaultValue: 'Ceme' })}
                            value={formData.materialSearch}
                            onChange={(e) => handleChange('materialSearch', e.target.value)}
                            className="[&>input]:pl-12 "
                        />
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <label className="block text-primary font-medium">
                            {t('addUsagePage.quantity', { defaultValue: 'Quantity' })}*
                        </label>
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="00"
                                value={formData.quantity}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        handleChange('quantity', val);
                                    }
                                }}
                                className="[&>input]:pr-20"
                            />
                            <span className="absolute right-6 text-sm sm:text-base text-[#060C1280] font-medium pointer-events-none">
                                {formData.unit}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="block text-sm sm:text-base font-semibold text-black">
                            {t('addUsagePage.description', { defaultValue: 'Description' })}
                        </label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(val) => handleChange('description', val)}
                            placeholder={t('addUsagePage.enterText', { defaultValue: 'Enter text here' })}
                            className="!rounded-3xl"
                        />
                    </div>
                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="secondary"
                            className="px-10 py-3"
                            onClick={handleCancel}
                        >
                            {t('addUsagePage.cancel', { defaultValue: 'Cancel' })}
                        </Button>
                        <Button
                            variant="primary"
                            className="px-10 py-3"
                            onClick={handleSubmit}
                        >
                            {t('addUsagePage.addLog', { defaultValue: 'Add Log' })}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
