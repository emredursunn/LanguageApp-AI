import { NavigationProp } from '@react-navigation/native';
import { Dimensions, View } from 'react-native';

export const Header = async (navigation: NavigationProp<any>) => {

    const {width} = Dimensions.get("screen");

    <View style={{borderWidth:1, width:width, paddingVertical:12}}>
        
    </View>

};
