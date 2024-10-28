import React, { ReactNode } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Props = {
    children: ReactNode;
};

const AnimatedFormContainer = ({ children }: Props) => {

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            style={{ flex: 1, padding: 16 }}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedFormContainer;
