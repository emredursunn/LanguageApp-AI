import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useQuery } from 'react-query'
import { getSavedStoriesByLanguageId } from '../../services/userService'
import { IStory } from '../../types/Story'
import Loading from '../../components/common/Loading'
import Error from '../../components/common/Error'
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TabStackParamList } from '../../types/stackNavigations'
import Entypo from '@expo/vector-icons/Entypo';

const RenderItem = ({item,index, navigateStory} : {item:IStory,index:number, navigateStory: (storyId:number) => void}) => (
  <Animated.View
  entering={SlideInRight.duration(50 * (index + 1))}
  exiting={SlideOutLeft}
  style={styles.card}
>

  <TouchableOpacity onPress={() => navigateStory(item.id)} style={styles.innerCard}>
    <View style={{flexDirection:'row', gap:16, alignItems:'center'}}>
      <Entypo name="open-book" size={32} color="green" />
      <Text style={styles.title}>{item.storyTitle}</Text>
    </View>
  </TouchableOpacity>
</Animated.View>
)

const SavedStoriesListScreen = () => {
  const {languageId} = useRoute<any>().params
  const { navigate } =
    useNavigation<NativeStackNavigationProp<TabStackParamList, "Settings">>();
  const [stories,setStories] = useState<IStory[]>([])
  
  const {isFetching,isError} = useQuery(['getSavedStoriesByLanguageId'],
    () => getSavedStoriesByLanguageId({languageId}),
    {enabled:!!languageId,
      onSuccess(data) {
        setStories(data.data)
      },
    }
  )

  if(isFetching){
    return <Loading />
  }

  if(isError){
    return <Error />
  }

  return (
    <ScrollView style={{flex:1, backgroundColor:'white', paddingTop:24}} contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
      {stories.map((story,index) => (
        <RenderItem key={story.id} item={story} index={index} navigateStory={() => navigate("SavedStoryScreen",{languageId,storyId:story.id})}/>
      ))}
    </ScrollView>
  )
}

export default SavedStoriesListScreen

const styles= StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  innerCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title:{
    fontWeight:'bold',
    fontSize:24
  }
})