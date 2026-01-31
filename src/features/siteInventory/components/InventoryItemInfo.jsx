/**
 * Inventory Item Info Component
 * Displays item name, unit, and optional details (lastUpdated or projectName)
 */

import { useTranslation } from "react-i18next";

export default function InventoryItemInfo({
  itemName,
  specification,
  quantityUnit,
  lastUpdated,
  projectName,
  formatDate,
}) {
  const { t } = useTranslation("siteInventory");

  return (
    <div className="mb-4 sm:mb-6">
      {/* Material Name */}
      <p className="text-primary font-medium text-base sm:text-lg">
        {itemName} <span className="text-secondary">• {quantityUnit}</span>
      </p>

      {/* Description */}
      {specification && (
        <p className="text-secondary text-sm mt-1">{specification}</p>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-secondary text-sm mt-1">
          {t("itemDetails.lastUpdated", { defaultValue: "Last Updated" })}:{" "}
          {formatDate(lastUpdated)}
        </p>
      )}

      {projectName && !lastUpdated && (
        <p className="text-secondary text-sm mt-1">{projectName}</p>
      )}
    </div>
  );
}
