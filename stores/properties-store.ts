import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Property } from "@/types";
import { properties as mockProperties } from "@/mocks/data";

interface PropertiesState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: () => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (propertyId: string) => void;
  addUnit: (propertyId: string, unit: any) => void;
  updateUnit: (propertyId: string, unit: any) => void;
  deleteUnit: (propertyId: string, unitId: string) => void;
  addRental: (propertyId: string, unitId: string, rental: any) => void;
  updateRental: (propertyId: string, unitId: string, rental: any) => void;
  deleteRental: (propertyId: string, unitId: string, rentalId: string) => void;
}

export const usePropertiesStore = create<PropertiesState>()(
  persist(
    (set, get) => ({
      properties: [],
      loading: false,
      error: null,

      fetchProperties: () => {
        set({ loading: true, error: null });

        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          set({ properties: mockProperties, loading: false });
        }, 500);
      },

      addProperty: (property) => {
        set((state) => ({
          properties: [...state.properties, property],
        }));
      },

      updateProperty: (property) => {
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === property.id ? property : p
          ),
        }));
      },

      deleteProperty: (propertyId) => {
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== propertyId),
        }));
      },

      addUnit: (propertyId, unit) => {
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId
              ? { ...property, units: [...property.units, unit] }
              : property
          ),
        }));
      },

      updateUnit: (propertyId, unit) => {
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId
              ? {
                  ...property,
                  units: property.units.map((u) =>
                    u.id === unit.id ? unit : u
                  ),
                }
              : property
          ),
        }));
      },

      deleteUnit: (propertyId, unitId) => {
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId
              ? {
                  ...property,
                  units: property.units.filter((u) => u.id !== unitId),
                }
              : property
          ),
        }));
      },

      addRental: (propertyId, unitId, rental) => {
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId
              ? {
                  ...property,
                  units: property.units.map((unit) =>
                    unit.id === unitId
                      ? { ...unit, rentals: [...unit.rentals, rental] }
                      : unit
                  ),
                }
              : property
          ),
        }));
      },

      updateRental: (propertyId, unitId, rental) => {
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId
              ? {
                  ...property,
                  units: property.units.map((unit) =>
                    unit.id === unitId
                      ? {
                          ...unit,
                          rentals: unit.rentals.map((r) =>
                            r.id === rental.id ? rental : r
                          ),
                        }
                      : unit
                  ),
                }
              : property
          ),
        }));
      },

      deleteRental: (propertyId, unitId, rentalId) => {
        set((state) => ({
          properties: state.properties.map((property) =>
            property.id === propertyId
              ? {
                  ...property,
                  units: property.units.map((unit) =>
                    unit.id === unitId
                      ? {
                          ...unit,
                          rentals: unit.rentals.filter(
                            (r) => r.id !== rentalId
                          ),
                        }
                      : unit
                  ),
                }
              : property
          ),
        }));
      },
    }),
    {
      name: "properties-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
