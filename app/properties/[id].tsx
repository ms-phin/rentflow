import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  ArrowLeft,
  MoreVertical,
  Building2,
  Home,
  MapPin,
} from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { usePropertiesStore } from "@/stores/properties-store";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { properties, fetchProperties } = usePropertiesStore();

  useEffect(() => {
    fetchProperties();
  }, []);

  // Find the property with the given ID
  const property = properties.find((p) => p.id === id);
  console.log("property", property);
  if (!property) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Property not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.white} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Calculate available and occupied units
  const availableUnits = property.units.filter(
    (unit) =>
      !unit.rentals.some(
        (rental) => rental.status === "active" || rental.status === "upcoming"
      )
  );

  const occupiedUnits = property.units.filter((unit) =>
    unit.rentals.some((rental) => rental.status === "active")
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: property.name,
          headerRight: () => (
            <Pressable
              style={styles.headerButton}
              onPress={() => console.log("More options")}
            >
              <MoreVertical size={24} color={colors.dark} />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {property.image ? (
            <Image
              source={{ uri: property.image }}
              style={styles.propertyImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.propertyImagePlaceholder}>
              <Building2 size={60} color={colors.gray} />
            </View>
          )}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <Pressable
                style={styles.editButton}
                onPress={() => router.push(`/properties/edit/${property.id}`)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
            </View>

            <View style={styles.addressContainer}>
              <MapPin size={18} color={colors.darkGray} />
              <Text style={styles.propertyAddress}>{property.address}</Text>
            </View>

            {property.description && (
              <Text style={styles.description}>{property.description}</Text>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{property.units.length}</Text>
                <Text style={styles.statLabel}>Total Units</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{availableUnits.length}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{occupiedUnits.length}</Text>
                <Text style={styles.statLabel}>Occupied</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Units</Text>
                <Pressable
                  style={styles.addButton}
                  onPress={() =>
                    router.push(`/units/new?propertyId=${property.id}`)
                  }
                >
                  <Plus size={18} color={colors.white} />
                  <Text style={styles.addButtonText}>Add Unit</Text>
                </Pressable>
              </View>

              {property.units.length > 0 ? (
                property.units.map((unit) => (
                  <Pressable
                    key={unit.id}
                    style={styles.unitCard}
                    onPress={() => router.push(`/units/${unit.id}`)}
                  >
                    <View style={styles.unitInfo}>
                      <Text style={styles.unitName}>{unit.name}</Text>
                      <View style={styles.unitDetails}>
                        {unit.size && (
                          <View style={styles.unitDetail}>
                            <Text style={styles.unitDetailValue}>
                              {unit.size}
                            </Text>
                            <Text style={styles.unitDetailLabel}>sq ft</Text>
                          </View>
                        )}
                        {unit.bedrooms && (
                          <View style={styles.unitDetail}>
                            <Text style={styles.unitDetailValue}>
                              {unit.bedrooms}
                            </Text>
                            <Text style={styles.unitDetailLabel}>bed</Text>
                          </View>
                        )}
                        {unit.bathrooms && (
                          <View style={styles.unitDetail}>
                            <Text style={styles.unitDetailValue}>
                              {unit.bathrooms}
                            </Text>
                            <Text style={styles.unitDetailLabel}>bath</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.unitStatus}>
                      {unit.rentals.some(
                        (rental) => rental.status === "active"
                      ) ? (
                        <View
                          style={[styles.statusBadge, styles.occupiedBadge]}
                        >
                          <Text style={styles.statusText}>Occupied</Text>
                        </View>
                      ) : unit.rentals.some(
                          (rental) => rental.status === "upcoming"
                        ) ? (
                        <View
                          style={[styles.statusBadge, styles.reservedBadge]}
                        >
                          <Text style={styles.statusText}>Reserved</Text>
                        </View>
                      ) : (
                        <View
                          style={[styles.statusBadge, styles.availableBadge]}
                        >
                          <Text style={styles.statusText}>Available</Text>
                        </View>
                      )}
                      {unit.rent && (
                        <Text style={styles.rentText}>${unit.rent}/mo</Text>
                      )}
                    </View>
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Home size={40} color={colors.gray} />
                  <Text style={styles.emptyStateText}>No units added yet</Text>
                  <Pressable
                    style={styles.emptyStateButton}
                    onPress={() =>
                      router.push(`/units/new?propertyId=${property.id}`)
                    }
                  >
                    <Plus size={16} color={colors.white} />
                    <Text style={styles.emptyStateButtonText}>Add Unit</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  propertyImage: {
    width: "100%",
    height: 200,
  },
  propertyImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
    flex: 1,
  },
  editButton: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  propertyAddress: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 24,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    ...shadows.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: colors.white,
    fontWeight: "500",
    marginLeft: 6,
  },
  unitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  unitInfo: {
    flex: 1,
  },
  unitName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 8,
  },
  unitDetails: {
    flexDirection: "row",
  },
  unitDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  unitDetailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  unitDetailLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 4,
  },
  unitStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  occupiedBadge: {
    backgroundColor: colors.occupied,
  },
  reservedBadge: {
    backgroundColor: colors.warning,
  },
  availableBadge: {
    backgroundColor: colors.available,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.white,
  },
  rentText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.dark,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    ...shadows.small,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.darkGray,
    marginTop: 12,
    marginBottom: 16,
  },
  emptyStateButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyStateButtonText: {
    color: colors.white,
    fontWeight: "500",
    marginLeft: 8,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: colors.white,
    fontWeight: "500",
    marginLeft: 8,
  },
});
