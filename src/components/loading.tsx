import LottieView from "lottie-react-native";
import { View } from "react-native";
import { WHITE } from "../utils/colors";

export default function Loading(){
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:WHITE }}>
        <LottieView
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
          source={require("../../assets/loading.json")}
        />
      </View>
    )
}