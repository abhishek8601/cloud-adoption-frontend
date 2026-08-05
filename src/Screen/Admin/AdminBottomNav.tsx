import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Tab = 'home' | 'events' | 'people' | 'tools' | 'profile';
const tabs = [
  {
    id: 'home',
    label: 'Home',
    route: '/admin-dashboard',
    icon: { ios: 'house', android: 'home', web: 'home' },
  },
  {
    id: 'events',
    label: 'Events',
    route: '/admin-events',
    icon: {
      ios: 'calendar',
      android: 'calendar_month',
      web: 'calendar_month',
    },
  },
  {
    id: 'people',
    label: 'People',
    route: '/admin-people',
    icon: { ios: 'person.2', android: 'group', web: 'group' },
  },
  {
    id: 'tools',
    label: 'Tools',
    route: '/admin-tools',
    icon: {
      ios: 'slider.horizontal.3',
      android: 'tune',
      web: 'tune',
    },
  },
  {
    id: 'profile',
    label: 'Profile',
    route: '/admin-profile',
    icon: { ios: 'person', android: 'person', web: 'person' },
  },
] as const;

export default function AdminBottomNav({ active }: { active: Tab }) {
  const router = useRouter();

  return (
    <View style={s.bar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => router.replace(tab.route)}
          style={[s.tab, active === tab.id && s.active]}
        >
          <SymbolView name={tab.icon} size={17} tintColor="#FFF" />
          <Text style={s.text}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    height: 62,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    minWidth: 43,
    alignItems: 'center',
    paddingVertical: 5,
  },
  active: {
    borderRadius: 17,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 8,
    marginTop: 2,
  },
});
