import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, CheckCheck } from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { useNotificationsStore } from "@/stores/notifications-store";
import { NotificationItem } from "@/components/NotificationItem";

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, fetchNotifications, markAllAsRead } =
    useNotificationsStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );
  const readNotifications = notifications.filter(
    (notification) => notification.read
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerRight: () => (
            <Pressable
              style={styles.headerButton}
              onPress={markAllAsRead}
              disabled={unreadNotifications.length === 0}
            >
              <CheckCheck
                size={24}
                color={
                  unreadNotifications.length > 0 ? colors.primary : colors.gray
                }
              />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {unreadNotifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>New</Text>
              {unreadNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onPress={() =>
                    router.push(`/notifications/${notification.id}`)
                  }
                />
              ))}
            </View>
          )}

          {readNotifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Earlier</Text>
              {readNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onPress={() =>
                    router.push(`/notifications/${notification.id}`)
                  }
                />
              ))}
            </View>
          )}

          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Bell size={60} color={colors.gray} />
              <Text style={styles.emptyStateTitle}>No notifications</Text>
              <Text style={styles.emptyStateText}>
                You don't have any notifications yet
              </Text>
            </View>
          )}
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginTop: 16,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: "center",
  },
});
