import Entypo from '@expo/vector-icons/Entypo'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated'
import { useQuery } from 'react-query'
import useI18n from '../../hooks/useI18n'
import { getStaticStoriesByLanguageId } from '../../services/userService'
import { RootStackParamList } from '../../types/stackNavigations'
import { IStory } from '../../types/Story'
import Error from '../common/Error'
import Loading from '../common/Loading'
import { Header } from '../Header'

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

const DefaultStoriesListScreen = () => {
  const {t} = useI18n("AllScreen");
  const navigation = useNavigation<any>();
  
  const {id} = useRoute<any>().params
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Story">>();
  const [stories,setStories] = useState<IStory[]>([])
  
  const {isFetching,isError} = useQuery(['getStaticStoriesByLanguageId'],
    () => getStaticStoriesByLanguageId({languageId:id}),
    {enabled:!!id,
      onSuccess(data) {
        setStories(data.results)
      },onError(err) {
        console.log("error",err)
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
    <ScrollView style={{flex:1, backgroundColor:'white', paddingTop:24,}} contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
      <View style={{paddingLeft:32}}>
        <Header navigation={navigation}/>
      </View>
      {stories && stories.map((story,index) => (
        <RenderItem key={story.id} item={{id:story.id,story:story.story,storyTitle:`${t('example')} ${index+1}`}} index={index} navigateStory={() => navigate("StaticStoryScreen", 
          {
          languageId:id,
          storyId:story.id,
      }
    )} />
      ))}
    </ScrollView>
  )
}

export default DefaultStoriesListScreen

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