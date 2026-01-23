import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Plus, Minus, ChevronRight } from 'lucide-react';
import AddMemberModal from './AddMemberModal';
import { useSubscriptions } from '../hooks';
import { getWorkspaceMembers } from '../../auth/api';
import { useAuth } from '../../auth/store';
import { showError } from '../../../utils/toast';
import { ROUTES_FLAT } from '../../../constants/routes';
import { updateAddon } from '../api/subscriptionApi';
import addCircleIcon from "../../../assets/icons/Add Circle.svg";

export default function AddOns({ onCalculationChange, onUsersChange }) {
  const { t } = useTranslation('subscription');
  const navigate = useNavigate();
  const { selectedWorkspace } = useAuth();
  const {
    subscriptions,
    purchasedPlan,
    hasActiveSubscription,
    planSummary,
    isLoadingSummary,
    fetchPlanSummary
  } = useSubscriptions();

  const [calculationQuantity, setCalculationQuantity] = useState(25); // Default increment unit
  const [isCalcEditEnabled, setIsCalcEditEnabled] = useState(false);
  const [memberQuantity, setMemberQuantity] = useState(1);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Constants - use planSummary for available counts, fallback to defaults
  const freeMembersCount = planSummary?.members?.available ?? (purchasedPlan?.free_sub_user_count || 0);
  const freeCalculationsCount = planSummary?.calculations?.available ?? (purchasedPlan?.free_calculation || 0);
  const planName = hasActiveSubscription && purchasedPlan ? purchasedPlan.name : 'Free';

  // Prices - use dynamic prices from purchasedPlan, fallback to defaults
  const memberPrice = parseFloat(purchasedPlan?.addMember?.price_per_member || 99);
  const calculationPricePerUnit = parseFloat(purchasedPlan?.addCalculation?.price_per_member || 10);
  const calculationMinPack = parseInt(purchasedPlan?.addCalculation?.minimum_calculation || 20);
  const calculationPackPrice = calculationPricePerUnit * calculationMinPack;

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedWorkspace) {
        setIsLoadingMembers(false);
        return;
      }

      try {
        setIsLoadingMembers(true);
        const response = await getWorkspaceMembers(selectedWorkspace);
        const membersData = response?.data || response?.members || response || [];
        const membersList = Array.isArray(membersData) ? membersData : [];

        const mappedMembers = membersList.map(member => ({
          id: member.id,
          name: member.name || '',
          role: member.role || '',
          phone: member.phone_number
            ? `${member.country_code || ''} ${member.phone_number}`.trim()
            : '',
        }));

        setMembers(mappedMembers);
      } catch (error) {
        console.error('Error fetching workspace members:', error);
        showError('Failed to load members');
        setMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [selectedWorkspace, refreshKey]);

  const handleUpdateAddon = async (type, action) => {
    if (!purchasedPlan?.id) return;

    try {
      await updateAddon({
        subscription_plan_id: purchasedPlan.id,
        type,
        action
      });
      // Refetch summary to update "Available" counts
      fetchPlanSummary(purchasedPlan.id);
    } catch (error) {
      console.error('Failed to update addon:', error);
      // Fallback state update is still done locally, but error is shown
      showError(t('common.error', { defaultValue: 'Action failed' }));
    }
  };

  const handleAddMemberClick = () => {
    setIsAddMemberModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddMemberModalOpen(false);
  };

  const handleMemberAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleViewAddedMembers = () => {
    navigate(ROUTES_FLAT.SUBSCRIPTION_ADDED_MEMBERS);
  };

  // Toggle Calculation Edit
  const handleToggleCalcEdit = () => {
    setIsCalcEditEnabled(prev => !prev);
  };

  // Notify parent when calculation quantity changes
  useEffect(() => {
    if (onCalculationChange) {
      onCalculationChange(calculationQuantity);
    }
  }, [calculationQuantity, onCalculationChange]);

  // Notify parent when members change
  useEffect(() => {
    if (onUsersChange) {
      // Assuming memberQuantity is the additional users being purchased
      // Total main users + sub users check
      const mainUsersCount = 1; // Default
      const subUsersCount = (members.length || freeMembersCount) + (memberQuantity - 1);
      onUsersChange(mainUsersCount, subUsersCount);
    }
  }, [memberQuantity, members, onUsersChange, freeMembersCount]);

  // Calculation Counter
  const handleCalcIncrement = () => {
    if (!isCalcEditEnabled) return;
    setCalculationQuantity(prev => prev + 1);
    handleUpdateAddon('calculation', 'add');
  };

  const handleCalcDecrement = () => {
    if (!isCalcEditEnabled || calculationQuantity <= 1) return;
    setCalculationQuantity(prev => prev - 1);
    handleUpdateAddon('calculation', 'remove');
  };

  // Member Counter
  const handleMemberIncrement = () => {
    setMemberQuantity(prev => prev + 1);
    handleUpdateAddon('member', 'add');
  };

  const handleMemberDecrement = () => {
    if (memberQuantity <= 1) return;
    setMemberQuantity(prev => prev - 1);
    handleUpdateAddon('member', 'remove');
  };

  return (
    <section className="mb-6">
      <h2 className="text-base md:text-lg font-medium text-primary mb-3">
        {t('addOns.title', { defaultValue: 'Add-ons' })}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Members Add-on Card */}
        <div className="bg-[#F6F6F6CC] rounded-2xl border border-[#060C120F] flex flex-col">
          <div className="p-4 md:p-5 flex-1">
            <div className="mb-4">
              <h3 className="text-base font-medium text-primary">
                {t('addOns.availableMembers')} <span className="text-accent">{freeMembersCount}</span>
              </h3>
              <p className="text-[13px] text-[#060C1280] mt-1">
                {t('addOns.membersSubtext', { count: freeMembersCount, plan: planName })}
              </p>
            </div>

            {/* Inner White Box */}
            <div className="bg-white rounded-xl p-4">
              <div
                className="flex items-center gap-2 mb-4 cursor-pointer group"
                onClick={handleAddMemberClick}
              >
                <img
                  src={addCircleIcon}
                  alt="Add"
                  className="w-5 h-5 flex-shrink-0"
                />
                <span className="text-accent text-sm md:text-base font-medium">
                  {t('addOns.addMoreMembers')}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Custom Counter Control */}
                <div className="flex items-center gap-2 border border-[#060C121A] rounded-lg bg-white p-1">
                  <button
                    onClick={handleMemberDecrement}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4 text-primary opacity-50" />
                  </button>
                  <div className="w-10 h-8 flex items-center justify-center bg-[#F6F6F6] rounded-md">
                    <span className="text-sm font-semibold text-primary">{memberQuantity}</span>
                  </div>
                  <button
                    onClick={handleMemberIncrement}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4 text-primary opacity-50" />
                  </button>
                </div>

                <p className="text-primary text-sm font-medium">
                  ₹{memberPrice}<span className="text-[#060C1280] font-normal">/{t('addOns.perMember')}</span>
                </p>
              </div>
            </div>

            {/* Bottom Row */}
            <button
              onClick={handleViewAddedMembers}
              className="flex items-center justify-between mt-2 cursor-pointer"
            >
              <span className=" text-primary">
                {t('addOns.viewAllAddedMembers')}
              </span>
              <ChevronRight className="w-4 h-4 text-[#060C124D] inline-block" />
            </button>
          </div>


        </div>

        {/* Calculations Add-on Card */}
        <div className="bg-[#F6F6F6CC] rounded-2xl border border-[#060C120F] flex flex-col">
          <div className="p-4 md:p-5 flex-1 text-left">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-primary">
                  {t('addOns.availableCalculations')} <span className="text-accent">{freeCalculationsCount}</span>
                </h3>
                <p className="text-[13px] text-[#060C1280] mt-1">
                  {t('addOns.calculationsSubtext', { count: freeCalculationsCount, plan: planName })}
                </p>
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer group shrink-0"
                onClick={handleToggleCalcEdit}
              >
                <img
                  src={addCircleIcon}
                  alt="Add"
                  className="w-5 h-5 flex-shrink-0"
                />
                <span className="text-accent text-[11px] md:text-sm font-medium whitespace-nowrap">
                  {t('addOns.addMoreCalculationPacks')}
                </span>
              </div>
            </div>

            {/* Inner White Box */}
            <div className={`bg-white rounded-xl p-4 transition-all ${!isCalcEditEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                {/* Custom Counter Control */}
                <div className="flex items-center gap-2 border border-[#060C121A] rounded-lg bg-white p-1">
                  <button
                    onClick={handleCalcDecrement}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4 text-primary opacity-50" />
                  </button>
                  <div className="w-10 h-8 flex items-center justify-center bg-[#F6F6F6] rounded-md">
                    <span className="text-sm font-semibold text-primary">{calculationQuantity}</span>
                  </div>
                  <button
                    onClick={handleCalcIncrement}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4 text-primary opacity-50" />
                  </button>
                </div>

                <p className="text-primary text-sm font-medium">
                  ₹{calculationPackPrice}<span className="text-[#060C1280] font-normal">/{t('addOns.perCalculations', { count: 25 })}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={handleCloseModal}
        onMemberAdded={handleMemberAdded}
        existingMembersCount={members.length}
        memberPrice={memberPrice}
      />
    </section>
  );
}

