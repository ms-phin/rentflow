import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Plus, ArrowRight } from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { usePropertiesStore } from "@/stores/properties-store";
import { useNotificationsStore } from "@/stores/notifications-store";
import { formatDateShort, getDaysRemaining } from "@/utils/date";
import { StatusBadge } from "@/components/StatusBadge";
import { NotificationItem } from "@/components/NotificationItem";

export default function DashboardScreen() {
  const router = useRouter();
  const { properties, fetchProperties } = usePropertiesStore();
  const { notifications, fetchNotifications } = useNotificationsStore();

  useEffect(() => {
    fetchProperties();
    fetchNotifications();
  }, []);

  // Get active rentals across all properties
  const activeRentals = properties.flatMap((property) =>
    property.units.flatMap((unit) =>
      unit.rentals.filter((rental) => rental.status === "active")
    )
  );

  // Get upcoming rentals
  const upcomingRentals = properties.flatMap((property) =>
    property.units.flatMap((unit) =>
      unit.rentals.filter((rental) => rental.status === "upcoming")
    )
  );

  // Get units with no active rentals
  const availableUnits = properties.flatMap((property) =>
    property.units.filter(
      (unit) =>
        !unit.rentals.some(
          (rental) => rental.status === "active" || rental.status === "upcoming"
        )
    )
  );

  // Get unread notifications
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>John Doe</Text>
          </View>
          <Pressable
            style={styles.notificationButton}
            onPress={() => router.push("/notifications")}
          >
            <Bell size={22} color={colors.dark} />
            {unreadNotifications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadNotifications.length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Rentals</Text>
            <Pressable
              style={styles.seeAllButton}
              onPress={() => router.push("/schedule")}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color={colors.primary} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {activeRentals.length > 0 ? (
              activeRentals.map((rental) => {
                const unit = properties
                  .flatMap((p) => p.units)
                  .find((u) => u.id === rental.unitId);

                const property = properties.find((p) =>
                  p.units.some((u) => u.id === rental.unitId)
                );

                const tenant = property?.units
                  .flatMap((u) => u.rentals)
                  .find((r) => r.id === rental.id)?.tenantId;

                const daysRemaining = getDaysRemaining(rental.endDate);

                return (
                  <Pressable
                    key={rental.id}
                    style={styles.rentalCard}
                    onPress={() => router.push(`/rentals/${rental.id}`)}
                  >
                    <View style={styles.cardHeader}>
                      <StatusBadge
                        status={daysRemaining <= 3 ? "endingSoon" : "occupied"}
                        text={
                          daysRemaining <= 3
                            ? `${daysRemaining} days left`
                            : "Active"
                        }
                      />
                    </View>
                    <Text style={styles.unitName}>{unit?.name}</Text>
                    <Text style={styles.propertyName}>{property?.name}</Text>
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateLabel}>Until:</Text>
                      <Text style={styles.date}>
                        {formatDateShort(rental.endDate)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No active rentals</Text>
                <Pressable
                  style={styles.addButton}
                  onPress={() => router.push("/rentals/new")}
                >
                  <Plus size={18} color={colors.white} />
                  <Text style={styles.addButtonText}>Add Rental</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Units</Text>
            <Pressable
              style={styles.seeAllButton}
              onPress={() => router.push("/properties")}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color={colors.primary} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {availableUnits.length > 0 ? (
              availableUnits.map((unit) => {
                const property = properties.find((p) =>
                  p.units.some((u) => u.id === unit.id)
                );

                return (
                  <Pressable
                    key={unit.id}
                    style={styles.unitCard}
                    onPress={() => router.push(`/units/${unit.id}`)}
                  >
                    {unit.image ? (
                      <Image
                        source={{ uri: unit.image }}
                        style={styles.unitImage}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.unitImagePlaceholder} />
                    )}
                    <View style={styles.unitCardContent}>
                      <StatusBadge status="available" text="Available" />
                      <Text style={styles.unitName}>{unit.name}</Text>
                      <Text style={styles.propertyName}>{property?.name}</Text>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No available units</Text>
                <Pressable
                  style={styles.addButton}
                  onPress={() => router.push("/units/new")}
                >
                  <Plus size={18} color={colors.white} />
                  <Text style={styles.addButtonText}>Add Unit</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={[styles.section, styles.notificationsSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <Pressable
              style={styles.seeAllButton}
              onPress={() => router.push("/notifications")}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={16} color={colors.primary} />
            </Pressable>
          </View>

          {unreadNotifications.length > 0 ? (
            unreadNotifications
              .slice(0, 3)
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onPress={() =>
                    router.push(`/notifications/${notification.id}`)
                  }
                />
              ))
          ) : (
            <View style={styles.emptyNotifications}>
              <Text style={styles.emptyStateText}>No new notifications</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
    color: colors.darkGray,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  rentalCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  unitName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
    color: colors.darkGray,
    marginRight: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  unitCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 4,
    overflow: "hidden",
    ...shadows.medium,
  },
  unitImage: {
    width: "100%",
    height: 100,
  },
  unitImagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: colors.lightGray,
  },
  unitCardContent: {
    padding: 16,
  },
  emptyState: {
    width: 200,
    height: 150,
    backgroundColor: colors.white,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    ...shadows.small,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: colors.white,
    fontWeight: "500",
    marginLeft: 8,
  },
  notificationsSection: {
    paddingHorizontal: 20,
  },
  emptyNotifications: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    ...shadows.small,
  },
});
