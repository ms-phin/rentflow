import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/Colors";

type StatusType = "available" | "occupied" | "endingSoon";

interface StatusBadgeProps {
  status: StatusType;
  text: string;
  large?: boolean;
}

export function StatusBadge({ status, text, large = false }: StatusBadgeProps) {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "available":
        return colors.available;
      case "occupied":
        return colors.occupied;
      case "endingSoon":
        return colors.endingSoon;
      default:
        return colors.gray;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${getStatusColor(status)}20` },
        large && styles.badgeLarge,
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: getStatusColor(status) },
          large && styles.dotLarge,
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: getStatusColor(status) },
          large && styles.textLarge,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  dotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  textLarge: {
    fontSize: 14,
    fontWeight: "600",
  },
});
