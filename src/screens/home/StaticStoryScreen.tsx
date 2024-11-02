import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { StoryContainer } from '../../components/story/StoryContainer'
import { useQuery } from 'react-query'
import { getStaticStoryDetail } from '../../services/userService'
import { IStory } from '../../types/Story'
import Loading from '../../components/common/Loading'
import Error from '../../components/common/Error'
import useI18n from '../../hooks/useI18n'

const StaticStoryScreen = () => {
  const {languageId, storyId} = useRoute<any>().params
  const [story,setStory] = useState<IStory | null>(null)
  const {t} = useI18n("AllScreen");

  const {isFetching, isError} = useQuery(['getStaticStoryDetail'], 
    () => getStaticStoryDetail({storyId}),
    { enabled:!!storyId,
      onSuccess(data) {
        const storyWithoutTitle = data.results[0]
        setStory({id:storyWithoutTitle.id,story:storyWithoutTitle.story,storyTitle:t('example')})
      },
    }
  )

  if(isFetching){
    return <Loading />;
  }

  if(isError){
    return <Error />
  }

  return (
    story ? <StoryContainer languageId={languageId} story={story.story} storyId={storyId} storyTitle={story.storyTitle}/>
    : null
  )
}

export default StaticStoryScreen
