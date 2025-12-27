/**
 * Coupon Page
 * Displays and manages subscription coupons
 * Uses feature API + shared UI components
 */

import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader';
import Loader from '../../../components/ui/Loader';
import Button from '../../../components/ui/Button';
import { ROUTES_FLAT } from '../../../constants/routes';
import couponIcon from '../../../assets/icons/Coupon.svg';
import { getEligibleCoupons } from '../api/subscriptionApi';
import { showError } from '../../../utils/toast';

/**
 * Format date range for validity display
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {string} Formatted validity string
 */
const formatValidity = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startDay = start.getDate();
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endDay = end.getDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endYear = end.getFullYear();
    
    // If same month and year
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${startDay}–${endDay} ${startMonth} ${endYear}`;
    }
    
    // If same year but different months
    if (start.getFullYear() === end.getFullYear()) {
      return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
    }
    
    // Different years
    return `${startDay} ${startMonth} ${start.getFullYear()} – ${endDay} ${endMonth} ${endYear}`;
  } catch (error) {
    return `${startDate} – ${endDate}`;
  }
};

export default function Coupon() {
  const { t } = useTranslation('subscription');
  const navigate = useNavigate();
  const location = useLocation();

  const [searchCode, setSearchCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState(null);

  // Get subscription plan ID from location state or use default
  const subscriptionPlanId = location.state?.subscriptionPlanId || location.state?.selectedPlan?.apiId || '2';

  // Fetch eligible coupons on mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getEligibleCoupons(subscriptionPlanId);
        
        // Map API response to component format
        const mappedCoupons = Array.isArray(response) ? response.map((coupon) => ({
          id: coupon.id,
          code: coupon.code,
          title: coupon.title,
          description: coupon.description,
          validity: formatValidity(coupon.start_date, coupon.end_date),
          // Include original data for potential future use
          originalData: coupon,
        })) : [];
        
        setCoupons(mappedCoupons);
      } catch (err) {
        console.error('Error fetching coupons:', err);
        setError(err);
        showError(t('coupon.fetchError', { defaultValue: 'Failed to load coupons. Please try again.' }));
        setCoupons([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, [subscriptionPlanId, t]);

  const normalizedSearch = searchCode.trim().toLowerCase();

  const filteredCoupons = useMemo(() => {
    if (!normalizedSearch) return coupons;
    return coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch, coupons]);

  const handleSearchChange = (e) => {
    setSearchCode(e.target.value);
  };

  const applyCouponAndGoBack = (coupon) => {
    if (!coupon) return;

    navigate(ROUTES_FLAT.SUBSCRIPTION, {
      state: {
        appliedCoupon: coupon,
      },
      replace: true,
    });
  };

  const handleTopApply = () => {
    const matching = coupons.find(
      (c) => c.code.toLowerCase() === normalizedSearch
    );
    if (matching) {
      applyCouponAndGoBack(matching);
    }
  };

  const handleCouponApply = (coupon) => {
    applyCouponAndGoBack(coupon);
  };

  return (
      <div className="max-w-7xl mx-auto px-0 md:px-4">
        <PageHeader
          title={t('header.coupon', { defaultValue: 'Apply Coupon' })}
          showBackButton
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {/* Search bar with inline Apply text button (like design) */}
            <div className="mb-4 sm:mb-6">
              <div className="w-full rounded-2xl border border-lightGray bg-secondary-light flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3">
                <input
                  type="text"
                  value={searchCode}
                  onChange={handleSearchChange}
                  placeholder={t('coupon.searchPlaceholder', {
                    defaultValue: 'Enter Coupon Code',
                  })}
                  className="flex-1 bg-transparent text-sm md:text-base text-primary placeholder:text-secondary focus:outline-none border-none"
                />
                <button
                  type="button"
                  onClick={handleTopApply}
                  disabled={!normalizedSearch}
                  className={`ml-3 text-sm md:text-base font-medium cursor-pointer ${
                    normalizedSearch
                      ? 'text-accent'
                      : 'text-accent/40 cursor-default'
                  }`}
                >
                  {t('coupon.applyButton', { defaultValue: 'Apply' })}
                </button>
              </div>
            </div>

            {/* Available Coupons label */}
            <h2 className="text-sm md:text-base font-medium text-primary mb-3">
              {t('coupon.availableCoupons', { defaultValue: 'Available Coupons' })}
            </h2>

            {/* Coupons list */}
            <div className="space-y-3 sm:space-y-4 pb-4">
              {filteredCoupons.map((coupon) => (
                <article
                  key={coupon.id}
                  className="bg-white rounded-2xl border border-[#E5E7EB] flex overflow-hidden max-h-[170px]"
                >
                  {/* Left coupon strip with image and text overlay (hidden on small screens) */}
                  <div className="hidden sm:block w-[60px] flex-shrink-0 relative overflow-hidden">
                    <img
                      src={couponIcon}
                      alt={t('coupon.couponCodeLabel', { defaultValue: 'Coupon Code' })}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="!text-[14px] sm:text-xs font-semibold uppercase tracking-[0.13em] text-white whitespace-pre leading-tight rotate-180"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                      >
                        {t('coupon.couponCodeLabel', {
                          defaultValue: 'COUPON CODE',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Middle content */}
                  <div className="flex-1 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 flex flex-col justify-between">
                    <div className="flex flex-col gap-1 sm:gap-1.5">
                      <p className="text-xs sm:text-sm font-medium text-primary-light">
                        {coupon.title}
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-primary">
                        {coupon.code}
                      </p>
                      <p className="text-xs sm:text-sm text-[#2563EB] cursor-pointer">
                        {coupon.description}
                      </p>
                    </div>
                    <p className="text-[11px] sm:text-xs text-primary-light mt-1 sm:mt-1.5">
                      {t('coupon.validityLabel', { defaultValue: 'Validity:' })}{' '}
                      {coupon.validity}
                    </p>
                  </div>

                  {/* Right Apply button */}
                  <div className="pr-3 pt-3 flex items-start justify-end">
                    <Button
                      variant="primary"
                      size="md"
                      className="whitespace-nowrap rounded-xl px-3 py-1.5 text-xs sm:px-3 sm:py-1.5 sm:text-xs md:px-5 md:py-2 md:text-sm"
                      onClick={() => handleCouponApply(coupon)}
                    >
                      {t('coupon.applyButton', { defaultValue: 'Apply' })}
                    </Button>
                  </div>
                </article>
              ))}

              {!filteredCoupons.length && (
                <p className="text-secondary text-sm mt-2">
                  {t('emptyState.noCoupons', { defaultValue: 'No coupons available.' })}
                </p>
              )}
            </div>
          </>
        )}
      </div>
  );
}
