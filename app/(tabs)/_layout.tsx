import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    const getIcon = (
        iosName: string,
        androidName: keyof typeof Ionicons.glyphMap
    ) => {
        return Platform.OS === 'ios'
            ? (props: any) => <IconSymbol size={28} name={iosName} {...props} />
            : (props: any) => <Ionicons name={androidName} size={28} {...props} />;
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: { position: 'absolute' },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: getIcon('house.fill', 'home'),
                }}
            />
            <Tabs.Screen
                name="credit"
                options={{
                    title: 'Credit',
                    tabBarIcon: getIcon('person.fill', 'person'),
                }}
            />
        </Tabs>
    );
}