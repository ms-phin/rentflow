import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Calendar } from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { Rental } from "@/types";
import { formatDate, getDaysRemaining } from "@/utils/date";
import { StatusBadge } from "./StatusBadge";

interface RentalItemProps {
  rental: Rental;
  onPress: () => void;
}

export function RentalItem({ rental, onPress }: RentalItemProps) {
  const getStatusInfo = () => {
    switch (rental.status) {
      case "active":
        const daysRemaining = getDaysRemaining(rental.endDate);
        return {
          status: daysRemaining <= 3 ? "endingSoon" : "occupied",
          text: daysRemaining <= 3 ? `${daysRemaining} days left` : "Active",
        };
      case "upcoming":
        return { status: "available", text: "Upcoming" };
      case "completed":
        return { status: "available", text: "Completed" };
      case "cancelled":
        return { status: "endingSoon", text: "Cancelled" };
      default:
        return { status: "available", text: "Unknown" };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Calendar size={20} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.tenantName}>
            {/* In a real app, you would fetch tenant name */}
            Tenant Name
          </Text>
          <StatusBadge
            status={statusInfo.status as any}
            text={statusInfo.text}
          />
        </View>
        <View style={styles.dates}>
          <Text style={styles.dateLabel}>From:</Text>
          <Text style={styles.date}>{formatDate(rental.startDate)}</Text>
          <Text style={styles.dateLabel}>To:</Text>
          <Text style={styles.date}>{formatDate(rental.endDate)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...shadows.small,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },
  dates: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  dateLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginRight: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.dark,
    marginRight: 12,
  },
});
