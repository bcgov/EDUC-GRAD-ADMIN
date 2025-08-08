import { useAccessStore } from '@/store/modules/access'
export function usePermissionBasedDropdown(options) {
  const {
    items,
    currentValue,
    itemValueKey,
    permissionKey,
    allowedCodes,                   // Array of allowed codes for the permission
    defaultAllowedCodes,      // Default codes for all users
  } = options

  const accessStore = useAccessStore()
  // Filter items based on permissions
  const filteredItems = () => {
    if (accessStore.hasPermissions('STUDENT', permissionKey)) {
      return items.filter(code => allowedCodes?.includes(code[itemValueKey]))
    } else {
      return items.filter(code => defaultAllowedCodes?.includes(code[itemValueKey]))
    }
  }

  // Check if an option should be disabled
  const isOptionDisabled = (option) => {
    const allowedCodes = filteredItems().map(code => code[itemValueKey])
    return !allowedCodes.includes(option[itemValueKey])
  }

  // Display items including current value if not in filtered list
  const displayItems = () => {
    const currentVal = currentValue
    const filteredOptions = filteredItems()

    // If there's a current value, and it's not in the filtered options, add it
    if (currentVal && !filteredOptions.find(option => option[itemValueKey] === currentVal)) {
      const currentOption = items.find(option => option[itemValueKey] === currentVal)
      if (currentOption) {
        return [...filteredOptions, currentOption]
      }
    }
    return filteredOptions
  }

  // Can only clear if they have permission to edit the current value
  const canClear = () => {
    if (!currentValue) return true
    return filteredItems().some(option => option[itemValueKey] === currentValue)
  }
  return {
    filteredItems,
    displayItems,
    isOptionDisabled,
    canClear
  }
}