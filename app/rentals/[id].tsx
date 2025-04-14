// import React, { useEffect } from "react";
// import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
// import { useLocalSearchParams, useRouter, Stack } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   Calendar,
//   Edit,
//   ArrowLeft,
//   MoreVertical,
//   Home,
//   User,
//   Clock,
//   CalendarCheck,
//   CalendarX,
//   FileText,
// } from "lucide-react-native";
// import { colors, shadows } from "@/constants/Colors";
// import { usePropertiesStore } from "@/stores/properties-store";
// import { formatDate, getDaysRemaining, getDaysElapsed } from "@/utils/date";
// import { StatusBadge } from "@/components/StatusBadge";

// export default function RentalDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const { properties, fetchProperties } = usePropertiesStore();

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   // Find the rental, unit and property
//   let rental;
//   let unit;
//   let property;

//   for (const p of properties) {
//     for (const u of p.units) {
//       const foundRental = u.rentals.find((r) => r.id === id);
//       if (foundRental) {
//         rental = foundRental;
//         unit = u;
//         property = p;
//         break;
//       }
//     }
//     if (rental) break;
//   }

//   if (!rental || !unit || !property) {
//     return (
//       <View style={styles.notFound}>
//         <Text style={styles.notFoundText}>Rental not found</Text>
//         <Pressable style={styles.backButton} onPress={() => router.back()}>
//           <ArrowLeft size={20} color={colors.white} />
//           <Text style={styles.backButtonText}>Go Back</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   // Calculate days remaining or days elapsed
//   const daysRemaining =
//     rental.status === "active" ? getDaysRemaining(rental.endDate) : null;
//   const daysElapsed =
//     rental.status === "active" ? getDaysElapsed(rental.startDate) : null;

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           title: "Rental Details",
//           headerRight: () => (
//             <Pressable
//               style={styles.headerButton}
//               onPress={() => console.log("More options")}
//             >
//               <MoreVertical size={24} color={colors.dark} />
//             </Pressable>
//           ),
//         }}
//       />
//       <SafeAreaView style={styles.container} edges={["bottom"]}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={styles.content}>
//             <View style={styles.statusCard}>
//               <StatusBadge
//                 status={
//                   rental.status === "active"
//                     ? daysRemaining && daysRemaining <= 3
//                       ? "endingSoon"
//                       : "occupied"
//                     : rental.status === "upcoming"
//                     ? "available"
//                     : "available"
//                 }
//                 text={
//                   rental.status === "active"
//                     ? daysRemaining && daysRemaining <= 3
//                       ? `Ending in ${daysRemaining} days`
//                       : "Active Rental"
//                     : rental.status === "upcoming"
//                     ? "Upcoming Rental"
//                     : "Completed Rental"
//                 }
//                 large
//               />

//               <View style={styles.dateContainer}>
//                 <View style={styles.dateItem}>
//                   <CalendarCheck size={20} color={colors.success} />
//                   <View style={styles.dateTextContainer}>
//                     <Text style={styles.dateLabel}>Check-in</Text>
//                     <Text style={styles.dateValue}>
//                       {formatDate(rental.startDate)}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.dateDivider} />
//                 <View style={styles.dateItem}>
//                   <CalendarX size={20} color={colors.danger} />
//                   <View style={styles.dateTextContainer}>
//                     <Text style={styles.dateLabel}>Check-out</Text>
//                     <Text style={styles.dateValue}>
//                       {formatDate(rental.endDate)}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               {rental.status === "active" &&
//                 daysElapsed !== null &&
//                 daysRemaining !== null && (
//                   <View style={styles.progressContainer}>
//                     <View style={styles.progressHeader}>
//                       <Text style={styles.progressLabel}>Rental Progress</Text>
//                       <Text style={styles.progressText}>
//                         {daysElapsed} days elapsed / {daysRemaining} days
//                         remaining
//                       </Text>
//                     </View>
//                     <View style={styles.progressBarContainer}>
//                       <View
//                         style={[
//                           styles.progressBar,
//                           {
//                             width: `${
//                               (daysElapsed / (daysElapsed + daysRemaining)) *
//                               100
//                             }%`,
//                             backgroundColor:
//                               daysRemaining <= 3
//                                 ? colors.warning
//                                 : colors.primary,
//                           },
//                         ]}
//                       />
//                     </View>
//                   </View>
//                 )}
//             </View>

//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Rental Information</Text>

//               <View style={styles.infoCard}>
//                 <View style={styles.infoItem}>
//                   <Home size={20} color={colors.primary} />
//                   <View style={styles.infoTextContainer}>
//                     <Text style={styles.infoLabel}>Unit</Text>
//                     <Text
//                       style={styles.infoValue}
//                       onPress={() => router.push(`/units/${unit.id}`)}
//                     >
//                       {unit.name}
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.infoDivider} />

//                 <View style={styles.infoItem}>
//                   <User size={20} color={colors.secondary} />
//                   <View style={styles.infoTextContainer}>
//                     <Text style={styles.infoLabel}>Tenant</Text>
//                     <Text
//                       style={styles.infoValue}
//                       onPress={() => router.push(`/tenants/${rental.tenantId}`)}
//                     >
//                       {/* In a real app, you would fetch tenant name */}
//                       Tenant Name
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.infoDivider} />

//                 <View style={styles.infoItem}>
//                   <Clock size={20} color={colors.info} />
//                   <View style={styles.infoTextContainer}>
//                     <Text style={styles.infoLabel}>Duration</Text>
//                     <Text style={styles.infoValue}>30 days</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {rental.notes && (
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Notes</Text>
//                 <View style={styles.notesCard}>
//                   <FileText
//                     size={20}
//                     color={colors.darkGray}
//                     style={styles.notesIcon}
//                   />
//                   <Text style={styles.notesText}>{rental.notes}</Text>
//                 </View>
//               </View>
//             )}

//             <View style={styles.buttonContainer}>
//               <Pressable
//                 style={styles.editButton}
//                 onPress={() => router.push(`/rentals/edit/${rental.id}`)}
//               >
//                 <Edit size={20} color={colors.dark} />
//                 <Text style={styles.editButtonText}>Edit Rental</Text>
//               </Pressable>

//               {rental.status === "active" && (
//                 <Pressable
//                   style={styles.completeButton}
//                   onPress={() => console.log("Complete rental")}
//                 >
//                   <Text style={styles.completeButtonText}>Complete Early</Text>
//                 </Pressable>
//               )}

//               {rental.status === "upcoming" && (
//                 <Pressable
//                   style={styles.cancelButton}
//                   onPress={() => console.log("Cancel rental")}
//                 >
//                   <Text style={styles.cancelButtonText}>Cancel Rental</Text>
//                 </Pressable>
//               )}
//             </View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   headerButton: {
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   statusCard: {
//     backgroundColor: colors.white,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 24,
//     ...shadows.medium,
//   },
//   dateContainer: {
//     flexDirection: "row",
//     marginTop: 16,
//   },
//   dateItem: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   dateTextContainer: {
//     marginLeft: 8,
//   },
//   dateLabel: {
//     fontSize: 12,
//     color: colors.darkGray,
//   },
//   dateValue: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: colors.dark,
//     marginTop: 2,
//   },
//   dateDivider: {
//     width: 1,
//     height: "100%",
//     backgroundColor: colors.lightGray,
//     marginHorizontal: 16,
//   },
//   progressContainer: {
//     marginTop: 16,
//   },
//   progressHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   progressLabel: {
//     fontSize: 14,
//     color: colors.darkGray,
//   },
//   progressText: {
//     fontSize: 12,
//     color: colors.gray,
//   },
//   progressBarContainer: {
//     height: 8,
//     backgroundColor: colors.lightGray,
//     borderRadius: 4,
//     overflow: "hidden",
//   },
//   progressBar: {
//     height: "100%",
//     borderRadius: 4,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: colors.dark,
//     marginBottom: 16,
//   },
//   infoCard: {
//     backgroundColor: colors.white,
//     borderRadius: 16,
//     padding: 16,
//     ...shadows.medium,
//   },
//   infoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   infoTextContainer: {
//     marginLeft: 12,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: colors.darkGray,
//   },
//   infoValue: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: colors.dark,
//     marginTop: 2,
//   },
//   infoDivider: {
//     height: 1,
//     backgroundColor: colors.lightGray,
//   },
//   notesCard: {
//     backgroundColor: colors.white,
//     borderRadius: 16,
//     padding: 16,
//     ...shadows.medium,
//   },
//   notesIcon: {
//     marginBottom: 8,
//   },
//   notesText: {
//     fontSize: 14,
//     color: colors.darkGray,
//     lineHeight: 20,
//   },
//   buttonContainer: {
//     marginTop: 8,
//   },
//   editButton: {
//     flexDirection: "row",
//     backgroundColor: colors.lightGray,
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   editButtonText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: colors.dark,
//     marginLeft: 8,
//   },
//   completeButton: {
//     backgroundColor: colors.primary,
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//   },
//   completeButtonText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: colors.white,
//   },
//   cancelButton: {
//     backgroundColor: colors.danger,
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: "center",
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: colors.white,
//   },
//   notFound: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   notFoundText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: colors.dark,
//     marginBottom: 16,
//   },
//   backButton: {
//     flexDirection: "row",
//     backgroundColor: colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   backButtonText: {
//     color: colors.white,
//     fontWeight: "500",
//     marginLeft: 8,
//   },
// });
import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar,
  Edit,
  ArrowLeft,
  MoreVertical,
  Home,
  User,
  Clock,
  CalendarCheck,
  CalendarX,
  FileText,
} from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { usePropertiesStore } from "@/stores/properties-store";
import { formatDate, getDaysRemaining, getDaysElapsed } from "@/utils/date";
import { StatusBadge } from "@/components/StatusBadge";

export default function RentalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { properties, fetchProperties } = usePropertiesStore();

  useEffect(() => {
    fetchProperties();
  }, []);

  // Find the rental, unit and property
  let rental;
  let unit;
  let property;

  for (const p of properties) {
    for (const u of p.units) {
      const foundRental = u.rentals.find((r) => r.id === id);
      if (foundRental) {
        rental = foundRental;
        unit = u;
        property = p;
        break;
      }
    }
    if (rental) break;
  }

  if (!rental || !unit || !property) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Rental not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.white} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Calculate days remaining or days elapsed
  const daysRemaining =
    rental.status === "active" ? getDaysRemaining(rental.endDate) : null;
  const daysElapsed =
    rental.status === "active" ? getDaysElapsed(rental.startDate) : null;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Rental Details",
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
          <View style={styles.content}>
            <View style={styles.statusCard}>
              <StatusBadge
                status={
                  rental.status === "active"
                    ? daysRemaining && daysRemaining <= 3
                      ? "endingSoon"
                      : "occupied"
                    : rental.status === "upcoming"
                    ? "available"
                    : "available"
                }
                text={
                  rental.status === "active"
                    ? daysRemaining && daysRemaining <= 3
                      ? `Ending in ${daysRemaining} days`
                      : "Active Rental"
                    : rental.status === "upcoming"
                    ? "Upcoming Rental"
                    : "Completed Rental"
                }
                large
              />

              <View style={styles.dateContainer}>
                <View style={styles.dateItem}>
                  <CalendarCheck size={20} color={colors.success} />
                  <View style={styles.dateTextContainer}>
                    <Text style={styles.dateLabel}>Check-in</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(rental.startDate)}
                    </Text>
                  </View>
                </View>
                <View style={styles.dateDivider} />
                <View style={styles.dateItem}>
                  <CalendarX size={20} color={colors.danger} />
                  <View style={styles.dateTextContainer}>
                    <Text style={styles.dateLabel}>Check-out</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(rental.endDate)}
                    </Text>
                  </View>
                </View>
              </View>

              {rental.status === "active" &&
                daysElapsed !== null &&
                daysRemaining !== null && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Rental Progress</Text>
                      <Text style={styles.progressText}>
                        {daysElapsed} days elapsed / {daysRemaining} days
                        remaining
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${
                              (daysElapsed / (daysElapsed + daysRemaining)) *
                              100
                            }%`,
                            backgroundColor:
                              daysRemaining <= 3
                                ? colors.warning
                                : colors.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rental Information</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Home size={20} color={colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Unit</Text>
                    <Text
                      style={styles.infoValue}
                      onPress={() => router.push(`/units/${unit.id}`)}
                    >
                      {unit.name}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoDivider} />

                <View style={styles.infoItem}>
                  <User size={20} color={colors.secondary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Tenant</Text>
                    <Text
                      style={styles.infoValue}
                      onPress={() => router.push(`/tenants/${rental.tenantId}`)}
                    >
                      {/* In a real app, you would fetch tenant name */}
                      Tenant Name
                    </Text>
                  </View>
                </View>

                <View style={styles.infoDivider} />

                <View style={styles.infoItem}>
                  <Clock size={20} color={colors.info} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Duration</Text>
                    <Text style={styles.infoValue}>30 days</Text>
                  </View>
                </View>
              </View>
            </View>

            {rental.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <View style={styles.notesCard}>
                  <FileText
                    size={20}
                    color={colors.darkGray}
                    style={styles.notesIcon}
                  />
                  <Text style={styles.notesText}>{rental.notes}</Text>
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.editButton}
                onPress={() => router.push(`/rentals/edit/${rental.id}`)}
              >
                <Edit size={20} color={colors.dark} />
                <Text style={styles.editButtonText}>Edit Rental</Text>
              </Pressable>

              {rental.status === "active" && (
                <Pressable
                  style={styles.completeButton}
                  onPress={() => router.push(`/rentals/complete/${rental.id}`)}
                >
                  <Text style={styles.completeButtonText}>Complete Early</Text>
                </Pressable>
              )}

              {rental.status === "upcoming" && (
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => console.log("Cancel rental")}
                >
                  <Text style={styles.cancelButtonText}>Cancel Rental</Text>
                </Pressable>
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
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...shadows.medium,
  },
  dateContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  dateItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  dateTextContainer: {
    marginLeft: 8,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.darkGray,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
    marginTop: 2,
  },
  dateDivider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.lightGray,
    marginHorizontal: 16,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  progressText: {
    fontSize: 12,
    color: colors.gray,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.medium,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.darkGray,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.dark,
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
  notesCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.medium,
  },
  notesIcon: {
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 8,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.dark,
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  cancelButton: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
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
