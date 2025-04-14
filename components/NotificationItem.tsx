import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Bell, Calendar, Home, AlertCircle } from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { Notification } from "@/types";
import { formatDateShort } from "@/utils/date";

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

export function NotificationItem({
  notification,
  onPress,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "rental_ending":
        return <Calendar size={20} color={colors.warning} />;
      case "rental_started":
        return <Home size={20} color={colors.success} />;
      case "rental_completed":
        return <Calendar size={20} color={colors.primary} />;
      case "system":
        return <Bell size={20} color={colors.info} />;
      default:
        return <AlertCircle size={20} color={colors.darkGray} />;
    }
  };

  return (
    <Pressable
      style={[styles.container, !notification.read && styles.unread]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.date}>{formatDateShort(notification.date)}</Text>
      </View>
      {!notification.read && <View style={styles.unreadIndicator} />}
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
  unread: {
    backgroundColor: `${colors.primary}10`,
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
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: colors.gray,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
    alignSelf: "center",
  },
});
