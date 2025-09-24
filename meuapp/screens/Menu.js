import React from "react";
import { TouchableOpacity } from "react-native";
import { View,Text,StyleSheet,Image,Button, Alert } from "react-native";

export default function Menu(){
    const handleMenuPress = (link)=>{
        Alert.alert(`Você clicou em: $(link)`);
    };

    return(
        <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() =>handleMenuPress('Home')}>
              <Text style={styles.menuText}>Home</Text>  
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() =>handleMenuPress('Perfil')}>
              <Text style={styles.menuText}>Perfil</Text>  
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() =>handleMenuPress('Config')}>
              <Text style={styles.menuText}>Config</Text>  
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
   menu:{
    flexDirection:'row',
    justifyContent:'space-around',
    backgroundColor:'#6200EE',
    paddingVertical:10,
   },
   menuItem:{
    alignItems:'center',
   },
   menuText:{
    color:'#fff',
    fontSize:20,
   },
});