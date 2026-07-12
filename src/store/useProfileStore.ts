import { create } from 'zustand'
import type { UserProfile, Allergen, HealthCondition, ActivityLevel } from '../types'
import { DEFAULT_PROFILE } from '../types'
import { getStorageItem, setStorageItem } from '../utils/storage'

const STORAGE_KEY = 'pregnancy-profile'

interface ProfileState {
  profile: UserProfile
  isSet: boolean
  updateProfile: (partial: Partial<UserProfile>) => void
  updateAllergies: (allergies: Allergen[]) => void
  updateHealthConditions: (conditions: HealthCondition[]) => void
  updateActivityLevel: (level: ActivityLevel) => void
  resetProfile: () => void
}

function loadProfile(): UserProfile {
  return getStorageItem<UserProfile>(STORAGE_KEY, DEFAULT_PROFILE)
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: loadProfile(),
  isSet: loadProfile().name !== '',

  updateProfile: (partial) => {
    const newProfile = { ...get().profile, ...partial }
    setStorageItem(STORAGE_KEY, newProfile)
    set({ profile: newProfile, isSet: newProfile.name !== '' })
  },

  updateAllergies: (allergies) => {
    const newProfile = { ...get().profile, allergies }
    setStorageItem(STORAGE_KEY, newProfile)
    set({ profile: newProfile })
  },

  updateHealthConditions: (conditions) => {
    const newProfile = { ...get().profile, healthConditions: conditions }
    setStorageItem(STORAGE_KEY, newProfile)
    set({ profile: newProfile })
  },

  updateActivityLevel: (level) => {
    const newProfile = { ...get().profile, activityLevel: level }
    setStorageItem(STORAGE_KEY, newProfile)
    set({ profile: newProfile })
  },

  resetProfile: () => {
    setStorageItem(STORAGE_KEY, DEFAULT_PROFILE)
    set({ profile: DEFAULT_PROFILE, isSet: false })
  },
}))
