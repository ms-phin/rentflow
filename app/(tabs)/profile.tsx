import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Moon,
  HelpCircle,
  Shield,
  Building2,
} from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { useUserStore } from "@/stores/user-store";
import { useSettingsStore } from "@/stores/settings-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { darkMode, notifications, toggleDarkMode, toggleNotifications } =
    useSettingsStore();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={30} color={colors.white} />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || "User Name"}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || "user@example.com"}
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.editProfileButton}
            onPress={() => router.push("/profile/edit")}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/properties")}
          >
            <View style={styles.menuIconContainer}>
              <Building2 size={20} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>My Properties</Text>
              <ChevronRight size={20} color={colors.darkGray} />
            </View>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/notifications")}
          >
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={colors.secondary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Notifications</Text>
              <ChevronRight size={20} color={colors.darkGray} />
            </View>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/profile/security")}
          >
            <View style={styles.menuIconContainer}>
              <Shield size={20} color={colors.success} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Security</Text>
              <ChevronRight size={20} color={colors.darkGray} />
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Moon size={20} color={colors.dark} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{
                  false: colors.lightGray,
                  true: colors.primaryLight,
                }}
                thumbColor={darkMode ? colors.primary : colors.white}
              />
            </View>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={colors.warning} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Push Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{
                  false: colors.lightGray,
                  true: colors.primaryLight,
                }}
                thumbColor={notifications ? colors.primary : colors.white}
              />
            </View>
          </View>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/settings")}
          >
            <View style={styles.menuIconContainer}>
              <Settings size={20} color={colors.darkGray} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>App Settings</Text>
              <ChevronRight size={20} color={colors.darkGray} />
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/help")}
          >
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color={colors.info} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Help & Support</Text>
              <ChevronRight size={20} color={colors.darkGray} />
            </View>
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.logoutItem]}
            onPress={() => console.log("Logout")}
          >
            <View style={styles.menuIconContainer}>
              <LogOut size={20} color={colors.danger} />
            </View>
            <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
  },
  profileSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    ...shadows.medium,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.darkGray,
  },
  editProfileButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...shadows.small,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: colors.dark,
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    marginBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: colors.gray,
  },
});
