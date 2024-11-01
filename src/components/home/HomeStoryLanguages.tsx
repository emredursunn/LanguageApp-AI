import { FlatList} from 'react-native'
import React from 'react'
import HomeLanguageCard, { MenuLanguageCard } from './HomeLanguageCard'

type Props = {
    languages: MenuLanguageCard[]
}

const HomeStoryLanguages = ({languages}:Props) => {


  return (
    <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:300, justifyContent:'center', alignItems:'center'}} data={languages} numColumns={2} renderItem={({item,index}) => <HomeLanguageCard languageCard={item}/>}/>      
  )
}

export default HomeStoryLanguages
