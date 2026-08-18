import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PeopleDirectory from '../Common/PeopleDirectory';
import AdminBottomNav from './AdminBottomNav';
export default function AdminAllPeopleScreen(){return <View style={s.screen}><StatusBar style="dark"/><SafeAreaView style={s.safe}><View style={s.content}><PeopleDirectory/></View><AdminBottomNav active="people"/></SafeAreaView></View>};const s=StyleSheet.create({screen:{flex:1,backgroundColor:'#F7F8FC'},safe:{flex:1},content:{flex:1,padding:12,paddingBottom:0}});
