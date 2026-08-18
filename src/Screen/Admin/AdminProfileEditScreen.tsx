import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Field({ label, value, onChangeText, editable = true }: { label: string; value: string; onChangeText?: (value: string) => void; editable?: boolean }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><View style={[styles.inputWrap, !editable && styles.locked]}><TextInput value={value} editable={editable} onChangeText={onChangeText} style={styles.input} /><SymbolView name={{ ios: editable ? 'pencil' : 'lock', android: editable ? 'edit' : 'lock', web: editable ? 'edit' : 'lock' }} size={12} tintColor="#738198" /></View></View>;
}

export default function AdminProfileEditScreen() {
  const router = useRouter();
  const [name, setName] = useState('Admin User');
  const [phone, setPhone] = useState('+1 (415) 555-0100');
  const save = () => router.back();

  return <View style={styles.screen}><StatusBar style="dark" /><SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹</Text><Text style={styles.backLabel}>Profile</Text></Pressable><Pressable accessibilityLabel="Save profile" onPress={save} style={styles.savePill}><Text style={styles.savePillText}>Save</Text></Pressable></View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>CA</Text></View><View><Text style={styles.name}>Admin User</Text><Text style={styles.company}>Cloud Adoption Solutions</Text><View style={styles.role}><SymbolView name={{ ios: 'shield.fill', android: 'shield', web: 'shield' }} size={9} tintColor="#7C3AED" /><Text style={styles.roleText}>Administrator</Text></View></View></View>
      <Text style={styles.section}>ACCOUNT DETAILS</Text><View style={styles.card}><Field label="FULL NAME" value={name} onChangeText={setName} /><Field label="PHONE" value={phone} onChangeText={setPhone} /><Field label="EMAIL ADDRESS" value="admin@cloudadoptionsolutions.com" editable={false} /><Field label="ACCESS LEVEL" value="Full Administrator Access" editable={false} /></View>
      <Text style={styles.section}>SECURITY</Text><View style={styles.linksCard}>{['Change Password', 'Two-Factor Authentication'].map((item) => <Pressable key={item} style={styles.linkRow}><Text style={styles.linkText}>{item}</Text><Text style={styles.chevron}>›</Text></Pressable>)}</View>
      <Pressable accessibilityLabel="Save changes" onPress={save} style={styles.saveChanges}><Text style={styles.saveChangesText}>Save Changes</Text></Pressable>
    </ScrollView>
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({ screen:{flex:1,backgroundColor:'#F7F8FC'},safeArea:{flex:1},header:{height:52,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#FFF',borderBottomWidth:StyleSheet.hairlineWidth,borderColor:'#E4E8EF'},back:{flexDirection:'row',alignItems:'center'},backText:{marginTop:-2,fontSize:23,color:'#7C3AED'},backLabel:{marginLeft:2,fontSize:11,fontWeight:'800',color:'#253046'},savePill:{paddingHorizontal:11,paddingVertical:7,borderRadius:14,backgroundColor:'#7C3AED'},savePillText:{fontSize:9,fontWeight:'800',color:'#FFF'},content:{padding:12,paddingBottom:22},profileCard:{padding:14,borderRadius:12,flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',shadowColor:'#34425D',shadowOpacity:.07,shadowRadius:8,shadowOffset:{width:0,height:2},elevation:2},avatar:{width:40,height:40,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'#7C3AED'},avatarText:{fontSize:13,fontWeight:'800',color:'#FFF'},name:{marginLeft:10,fontSize:12,fontWeight:'800',color:'#253046'},company:{marginLeft:10,marginTop:3,fontSize:9,color:'#65758C'},role:{alignSelf:'flex-start',marginLeft:10,marginTop:5,paddingHorizontal:6,paddingVertical:3,gap:3,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'#F0E9FF'},roleText:{fontSize:7,fontWeight:'700',color:'#7C3AED'},section:{marginTop:15,marginBottom:7,fontSize:8,fontWeight:'800',letterSpacing:.4,color:'#62718A'},card:{padding:10,borderRadius:10,backgroundColor:'#FFF'},field:{marginBottom:10},label:{marginBottom:4,fontSize:8,fontWeight:'800',color:'#7C3AED'},inputWrap:{height:31,paddingRight:9,flexDirection:'row',alignItems:'center',borderWidth:1,borderRadius:6,borderColor:'#8B45F7'},locked:{borderColor:'#DCE3EC',backgroundColor:'#EEF3F9'},input:{flex:1,height:'100%',paddingHorizontal:9,paddingVertical:0,fontSize:10,color:'#354057'},linksCard:{overflow:'hidden',borderRadius:10,backgroundColor:'#FFF'},linkRow:{height:42,paddingHorizontal:11,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:StyleSheet.hairlineWidth,borderColor:'#E5E9F0'},linkText:{fontSize:10,color:'#6F32E5'},chevron:{fontSize:20,color:'#AAB5C6'},saveChanges:{height:34,marginTop:15,alignItems:'center',justifyContent:'center',borderRadius:7,backgroundColor:'#7C3AED',shadowColor:'#7C3AED',shadowOpacity:.25,shadowRadius:7,shadowOffset:{width:0,height:3},elevation:3},saveChangesText:{fontSize:10,fontWeight:'800',color:'#FFF'} });
