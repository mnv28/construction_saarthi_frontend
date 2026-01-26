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
import Loader from '../../../components/ui/Loader';
import { useInventoryTypes, useMaterials } from '../../siteInventory/hooks';


export default function AddUsage() {
    const { t } = useTranslation(['dashboard', 'common', 'calculation']);
    const navigate = useNavigate();
    const { selectedWorkspace } = useAuth();

    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    const { inventoryTypeOptions, isLoading: isLoadingInventoryTypes } = useInventoryTypes();

    const [formData, setFormData] = useState({
        projectId: '',
        materialType: '',
        materialId: '',
        quantity: '',
        unit: '',
        description: ''
    });

    const { materials, materialOptions, isLoadingMaterials, createNewMaterial } = useMaterials(formData.materialType);

    // Set default material type when options are loaded
    useEffect(() => {
        if (inventoryTypeOptions.length > 0 && !formData.materialType) {
            handleChange('materialType', inventoryTypeOptions[0].value);
        }
    }, [inventoryTypeOptions, formData.materialType]);

    // Clear materialId when materialType changes
    useEffect(() => {
        if (formData.materialType) {
            setFormData(prev => ({
                ...prev,
                materialId: '',
                unit: ''
            }));
        }
    }, [formData.materialType]);

    // Update unit when material is selected
    useEffect(() => {
        if (formData.materialId && materials.length > 0) {
            const selectedMaterial = materials.find(m => (m.id || m._id || m.materialId) === formData.materialId);
            if (selectedMaterial) {
                setFormData(prev => ({
                    ...prev,
                    unit: selectedMaterial.unit_name || selectedMaterial.unitName || ''
                }));
            }
        }
    }, [formData.materialId, materials]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!selectedWorkspace) return;
            try {
                setIsLoadingProjects(true);
                const data = await getAllProjects(selectedWorkspace);
                const projectOptions = data.map(p => ({
                    value: p.id || p.project_id,
                    label: p.name || p.details?.name || t('common.untitledProject', { ns: 'common' })
                }));
                setProjects(projectOptions);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setIsLoadingProjects(false);
            }
        };
        fetchProjects();
    }, [selectedWorkspace, t]);

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
            <div className="flex-1 pb-24">
                <PageHeader
                    title={t('addUsagePage.title')}
                    onBack={() => navigate(-1)}
                />

                <div className="mt-8 space-y-5">
                    {/* Project Selection */}
                    <div className="space-y-2">
                        <Dropdown
                            label={t('addUsagePage.projectSite')}
                            required
                            options={projects}
                            value={formData.projectId}
                            onChange={(val) => handleChange('projectId', val)}
                            placeholder={t('addUsagePage.selectProject')}
                            disabled={isLoadingProjects}
                            className=""
                        />
                    </div>

                    {/* Material Type */}
                    <div className="space-y-4">
                        <span className="block text-primary font-medium">
                            {t('addUsagePage.materialType')}
                        </span>
                        <div className="flex items-center gap-6 flex-wrap">
                            {isLoadingInventoryTypes ? (
                                <Loader size="sm" />
                            ) : (
                                inventoryTypeOptions.map((type) => (
                                    <Radio
                                        key={type.value}
                                        label={type.label}
                                        name="materialType"
                                        value={type.value}
                                        checked={formData.materialType?.toString() === type.value?.toString()}
                                        onChange={(e) => handleChange('materialType', e.target.value)}
                                        className="font-medium"
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Material Selection */}
                    <div className="space-y-2">
                        <Dropdown
                            label={t('addUsagePage.material', { defaultValue: 'Material' })}
                            required
                            options={materialOptions}
                            value={formData.materialId}
                            onChange={(val) => handleChange('materialId', val)}
                            placeholder={t('addUsagePage.materialPlaceholder', { defaultValue: 'Select Material' })}
                            disabled={isLoadingMaterials}
                        />
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <label className="block text-primary font-medium">
                            {t('addUsagePage.quantity')}*
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
                            {t('addUsagePage.description')}
                        </label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(val) => handleChange('description', val)}
                            placeholder={t('addUsagePage.enterText')}
                            className="!rounded-3xl"
                        />
                    </div>
                    {/* Footer Buttons */}
                    <div className="flex items-center gap-3 w-full md:justify-end md:w-auto">
                        <Button
                            variant="secondary"
                            className="flex-1 md:flex-none md:w-auto md:px-10 "
                            onClick={handleCancel}
                        >
                            {t('addUsagePage.cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 md:flex-none md:w-auto md:px-10 "
                            onClick={handleSubmit}
                        >
                            {t('addUsagePage.addLog')}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
