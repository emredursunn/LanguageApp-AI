import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { StoryContainer } from '../../components/story/StoryContainer'
import { useQuery } from 'react-query'
import { getSavedStoryDetail } from '../../services/userService'
import { IStory } from '../../types/Story'
import Loading from '../../components/common/Loading'
import Error from '../../components/common/Error'

const SavedStoryScreen = () => {
  const {languageId, storyId} = useRoute<any>().params
  const [story,setStory] = useState<IStory | null>(null)

  const {isFetching, isError} = useQuery(['getSavedStoryDetail'], 
    () => getSavedStoryDetail({storyId}),
    { enabled:!!storyId,
      onSuccess(data) {
        setStory(data.data[0])
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

export default SavedStoryScreen
