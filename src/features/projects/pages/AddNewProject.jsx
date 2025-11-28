/**
 * Add New Project Page
 * Multi-step form for creating a new project
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import Dropdown from '../../../components/ui/Dropdown';
import DatePicker from '../../../components/ui/DatePicker';
import Radio from '../../../components/ui/Radio';
import FileUpload from '../../../components/ui/FileUpload';
import { createProject, getBuilders, createBuilder } from '../api';
import { PROJECT_ROUTES } from '../constants';
import { showError, showSuccess } from '../../../utils/toast';

const STEPS = [
  { id: 1, label: 'Site Overview' },
  { id: 2, label: 'Project Specifications' },
  { id: 3, label: 'Upload Relevant Images /Documents (Optional)' },
];

export default function AddNewProject() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      site_name: '',
      address: '',
      builder_name: '',
      est_start_date: null,
      est_completion_date: null,
      project_status: 'in_progress',
    },
  });

  const projectStatus = watch('project_status');

  useEffect(() => {
    fetchBuilders();
  }, []);

  const fetchBuilders = async () => {
    try {
      const response = await getBuilders();
      const buildersList = response?.data || response || [];
      setBuilders(
        buildersList.map((builder) => ({
          value: builder.id?.toString() || builder.name,
          label: builder.name || builder.builder_name,
        }))
      );
    } catch (error) {
      console.error('Error fetching builders:', error);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File size should be less than 10MB');
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        showError('Only JPG and PNG files are allowed');
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBuilderAdd = async (newBuilder) => {
    try {
      const response = await createBuilder({ name: newBuilder.label });
      const newBuilderOption = {
        value: response?.data?.id?.toString() || newBuilder.value,
        label: newBuilder.label,
      };
      setBuilders((prev) => [...prev, newBuilderOption]);
      setValue('builder_name', newBuilderOption.value);
      return newBuilderOption;
    } catch (error) {
      console.error('Error creating builder:', error);
      showError('Failed to add builder. Please try again.');
      throw error;
    }
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      // Validate step 1 fields
      const siteNameValid = await trigger('site_name');
      const addressValid = await trigger('address');
      const builderValid = watch('builder_name');
      const startDateValid = watch('est_start_date');
      const statusValid = watch('project_status');
      
      if (!builderValid) {
        setError('builder_name', { type: 'manual', message: 'Please select a builder' });
        showError('Please select a builder');
        return;
      }
      if (!startDateValid) {
        setError('est_start_date', { type: 'manual', message: 'Please select an estimated start date' });
        showError('Please select an estimated start date');
        return;
      }
      
      isValid = siteNameValid && addressValid && builderValid && startDateValid && statusValid;
    } else if (currentStep === 2) {
      // Validate step 2 fields (will be added later)
      isValid = true; // For now, allow proceeding
    } else {
      isValid = true; // Step 3 is optional
    }

    if (isValid) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleSubmit(onSubmit)();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(PROJECT_ROUTES.PROJECTS);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formData = {
        ...data,
        profile_photo: profilePhoto,
        builder_name: data.builder_name,
        est_start_date: data.est_start_date ? new Date(data.est_start_date).toISOString() : null,
        est_completion_date: data.est_completion_date ? new Date(data.est_completion_date).toISOString() : null,
      };

      await createProject(formData);
      showSuccess('Project created successfully!');
      navigate(PROJECT_ROUTES.PROJECTS);
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create project. Please try again.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar - Progress Indicator */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 hidden lg:block">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary mb-8 hover:text-accent transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Add New Project</span>
          </button>

          <div className="space-y-6">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-secondary'
                    }`}
                  >
                    {isCompleted ? '✓' : step.id}
                  </div>
                  <div className="flex-1 pt-2">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isActive && (
                      <p className="text-xs text-secondary mt-1">
                        {step.id} of {STEPS.length}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-primary mb-4 hover:text-accent transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Add New Project</span>
            </button>
            <div className="flex items-center gap-2 mb-4">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full ${
                    currentStep >= step.id ? 'bg-accent' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-secondary">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}
            </p>
          </div>

          {/* Form Content */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                {STEPS[currentStep - 1].label}
              </h2>

              {/* Step 1: Site Overview */}
              {currentStep === 1 && (
                <form className="space-y-6">
                  {/* Upload Project Profile Photo */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Upload Project Profile Photo
                    </label>
                    <div className="flex items-center gap-6">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-accent transition-colors bg-gray-50"
                      >
                        {profilePhotoPreview ? (
                          <img
                            src={profilePhotoPreview}
                            alt="Profile preview"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-secondary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-secondary mb-2">
                          Supported Format: JPG, PNG (10MB EACH)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleProfilePhotoChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Site Name */}
                  <FormInput
                    label="Site Name"
                    name="site_name"
                    register={register('site_name', {
                      required: 'Site name is required',
                    })}
                    errors={errors}
                    placeholder="Enter site name"
                    required
                  />

                  {/* Address */}
                  <FormInput
                    label="Address"
                    name="address"
                    register={register('address', {
                      required: 'Address is required',
                    })}
                    errors={errors}
                    placeholder="Enter address"
                    required
                  />

                  {/* Builder Name */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Builder Name <span className="text-accent">*</span>
                    </label>
                    <Dropdown
                      options={builders}
                      value={watch('builder_name')}
                      onChange={(value) => {
                        setValue('builder_name', value);
                        clearErrors('builder_name');
                      }}
                      placeholder="Select builder"
                      showSeparator
                      addButtonLabel="Add New Builder"
                      onAddNew={handleBuilderAdd}
                      error={errors.builder_name?.message}
                    />
                    {errors.builder_name && (
                      <p className="mt-1 text-sm text-accent">{errors.builder_name.message}</p>
                    )}
                  </div>

                  {/* Est. Start Date */}
                  <div>
                    <DatePicker
                      label="Est. Start Date"
                      value={watch('est_start_date')}
                      onChange={(date) => {
                        setValue('est_start_date', date);
                        clearErrors('est_start_date');
                      }}
                      required
                      placeholder="dd/mm/yyyy"
                      error={errors.est_start_date?.message}
                    />
                    {errors.est_start_date && (
                      <p className="mt-1 text-sm text-accent">{errors.est_start_date.message}</p>
                    )}
                  </div>

                  {/* Est. Completion Date */}
                  <div>
                    <DatePicker
                      label="Est. Completion Date"
                      value={watch('est_completion_date')}
                      onChange={(date) => setValue('est_completion_date', date)}
                      placeholder="dd/mm/yyyy"
                      minDate={watch('est_start_date')}
                    />
                  </div>

                  {/* Project Status */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-3">
                      Project status <span className="text-accent">*</span>
                    </label>
                    <div className="flex gap-6">
                      <Radio
                        label="Upcoming"
                        name="project_status"
                        value="upcoming"
                        checked={projectStatus === 'upcoming'}
                        onChange={() => setValue('project_status', 'upcoming')}
                      />
                      <Radio
                        label="In Progress"
                        name="project_status"
                        value="in_progress"
                        checked={projectStatus === 'in_progress'}
                        onChange={() => setValue('project_status', 'in_progress')}
                      />
                    </div>
                    {errors.project_status && (
                      <p className="mt-1 text-sm text-accent">{errors.project_status.message}</p>
                    )}
                  </div>
                </form>
              )}

              {/* Step 2: Project Specifications */}
              {currentStep === 2 && (
                <div className="text-center py-12">
                  <p className="text-secondary">Project Specifications form will be added here</p>
                </div>
              )}

              {/* Step 3: Upload Documents */}
              {currentStep === 3 && (
                <div>
                  <FileUpload
                    title="Upload Relevant Documents"
                    supportedFormats="PDF, JPG, PNG"
                    maxSize={10}
                    maxSizeUnit="MB"
                    onFileSelect={(files) => {
                      console.log('Files selected:', files);
                      // Handle file uploads
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button variant="secondary" onClick={handleBack} disabled={isLoading}>
                  {currentStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Saving...'
                    : currentStep === STEPS.length
                    ? 'Save & Continue'
                    : 'Save & Continue'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

