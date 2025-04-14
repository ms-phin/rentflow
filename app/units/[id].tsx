import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  Calendar,
  Edit,
  ArrowLeft,
  MoreVertical,
  Building2,
} from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { usePropertiesStore } from "@/stores/properties-store";
import { formatDate, getDaysRemaining } from "@/utils/date";
import { StatusBadge } from "@/components/StatusBadge";
import { RentalItem } from "@/components/RentalItem";

export default function UnitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { properties, fetchProperties } = usePropertiesStore();

  useEffect(() => {
    fetchProperties();
  }, []);

  // Find the unit and its property
  const property = properties.find((p) => p.units.some((u) => u.id === id));
  const unit = property?.units.find((u) => u.id === id);

  if (!unit || !property) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Unit not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.white} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Get active rental if exists
  const activeRental = unit.rentals.find((r) => r.status === "active");

  // Get upcoming rentals
  const upcomingRentals = unit.rentals.filter((r) => r.status === "upcoming");

  // Get past rentals
  const pastRentals = unit.rentals.filter((r) => r.status === "completed");

  return (
    <>
      <Stack.Screen
        options={{
          title: unit.name,
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
          {unit.image ? (
            <Image
              source={{ uri: unit.image }}
              style={styles.unitImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.unitImagePlaceholder} />
          )}

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.unitName}>{unit.name}</Text>
              <View style={styles.headerButtons}>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => router.push(`/units/edit/${unit.id}`)}
                >
                  <Edit size={20} color={colors.dark} />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.propertyLink}
              onPress={() => router.push(`/properties/${property.id}`)}
            >
              <Building2 size={18} color={colors.darkGray} />
              <Text style={styles.propertyName}>{property.name}</Text>
            </Pressable>

            <Text style={styles.description}>
              {unit.description || "No description available"}
            </Text>

            <View style={styles.statusSection}>
              <Text style={styles.statusTitle}>Current Status</Text>
              <View style={styles.statusCard}>
                {activeRental ? (
                  <View>
                    <StatusBadge
                      status="occupied"
                      text="Currently Occupied"
                      large
                    />
                    <View style={styles.rentalInfo}>
                      <Text style={styles.rentalInfoLabel}>Tenant:</Text>
                      <Text style={styles.rentalInfoValue}>
                        {/* In a real app, you would fetch tenant name */}
                        Tenant Name
                      </Text>
                    </View>
                    <View style={styles.rentalInfo}>
                      <Text style={styles.rentalInfoLabel}>Check-in:</Text>
                      <Text style={styles.rentalInfoValue}>
                        {formatDate(activeRental.startDate)}
                      </Text>
                    </View>
                    <View style={styles.rentalInfo}>
                      <Text style={styles.rentalInfoLabel}>Check-out:</Text>
                      <Text style={styles.rentalInfoValue}>
                        {formatDate(activeRental.endDate)}
                      </Text>
                    </View>
                    <View style={styles.rentalInfo}>
                      <Text style={styles.rentalInfoLabel}>
                        Days remaining:
                      </Text>
                      <Text style={styles.rentalInfoValue}>
                        {getDaysRemaining(activeRental.endDate)} days
                      </Text>
                    </View>
                    <Pressable
                      style={styles.viewRentalButton}
                      onPress={() => router.push(`/rentals/${activeRental.id}`)}
                    >
                      <Text style={styles.viewRentalButtonText}>
                        View Rental Details
                      </Text>
                    </Pressable>
                  </View>
                ) : upcomingRentals.length > 0 ? (
                  <View>
                    <StatusBadge status="endingSoon" text="Reserved" large />
                    <View style={styles.rentalInfo}>
                      <Text style={styles.rentalInfoLabel}>Next check-in:</Text>
                      <Text style={styles.rentalInfoValue}>
                        {formatDate(upcomingRentals[0].startDate)}
                      </Text>
                    </View>
                    <Pressable
                      style={styles.viewRentalButton}
                      onPress={() =>
                        router.push(`/rentals/${upcomingRentals[0].id}`)
                      }
                    >
                      <Text style={styles.viewRentalButtonText}>
                        View Reservation
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View>
                    <StatusBadge status="available" text="Available" large />
                    <Text style={styles.availableText}>
                      This unit is currently available for rent
                    </Text>
                    <Pressable
                      style={styles.addRentalButton}
                      onPress={() =>
                        router.push(`/rentals/new?unitId=${unit.id}`)
                      }
                    >
                      <Plus size={18} color={colors.white} />
                      <Text style={styles.addRentalButtonText}>
                        Add New Rental
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Rentals</Text>
                <Pressable
                  style={styles.addButton}
                  onPress={() => router.push(`/rentals/new?unitId=${unit.id}`)}
                >
                  <Plus size={18} color={colors.white} />
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>

              {upcomingRentals.length > 0 ? (
                upcomingRentals.map((rental) => (
                  <RentalItem
                    key={rental.id}
                    rental={rental}
                    onPress={() => router.push(`/rentals/${rental.id}`)}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Calendar size={30} color={colors.gray} />
                  <Text style={styles.emptyStateText}>No upcoming rentals</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rental History</Text>

              {pastRentals.length > 0 ? (
                pastRentals.map((rental) => (
                  <RentalItem
                    key={rental.id}
                    rental={rental}
                    onPress={() => router.push(`/rentals/${rental.id}`)}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Calendar size={30} color={colors.gray} />
                  <Text style={styles.emptyStateText}>No rental history</Text>
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
  unitImage: {
    width: "100%",
    height: 200,
  },
  unitImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: colors.lightGray,
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
  unitName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  propertyLink: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  propertyName: {
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
  statusSection: {
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.medium,
  },
  rentalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  rentalInfoLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  rentalInfoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  viewRentalButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 16,
  },
  viewRentalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  availableText: {
    fontSize: 14,
    color: colors.darkGray,
    marginTop: 12,
    marginBottom: 16,
  },
  addRentalButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addRentalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    marginLeft: 8,
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
    marginBottom: 16,
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
