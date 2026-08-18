import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PeopleDirectory from '../Common/PeopleDirectory';

const tabs=[['Home','house','/dashboard'],['Agenda','calendar','/agenda'],['Charts','chart.bar','/charts'],['People','person.2',''],['Saved','bookmark','/saved'],['Profile','person','/profile']] as const;
export default function UserPeopleScreen(){const router=useRouter();return <View style={s.screen}><StatusBar style="dark"/><SafeAreaView style={s.safe}><View style={s.content}><PeopleDirectory/></View><View style={s.tabs}>{tabs.map(([label,icon,route])=><Pressable key={label} onPress={()=>route&&router.replace(route)} style={s.tab}><SymbolView name={{ios:icon,android:icon==='calendar'?'calendar_month':icon==='person.2'?'group':icon==='chart.bar'?'bar_chart':icon,web:icon==='calendar'?'calendar_month':icon==='person.2'?'group':icon==='chart.bar'?'bar_chart':icon} as never} size={18} tintColor={label==='People'?'#7B3FF0':'#64748B'}/><Text style={[s.tabText,label==='People'&&s.active]}>{label}</Text></Pressable>)}</View></SafeAreaView></View>};
const s=StyleSheet.create({screen:{flex:1,backgroundColor:'#F7F8FC'},safe:{flex:1},content:{flex:1,padding:13,paddingBottom:0},tabs:{height:67,paddingHorizontal:4,flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderTopWidth:StyleSheet.hairlineWidth,borderColor:'#E3E8F0',backgroundColor:'#FFF'},tab:{flex:1,alignItems:'center',gap:3},tabText:{fontSize:8,fontWeight:'600',color:'#64748B'},active:{fontWeight:'800',color:'#7B3FF0'}});
