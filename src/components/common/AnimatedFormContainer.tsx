import React, { ReactNode } from 'react';
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';

type Props = {
    direction: 'BACK' | 'NEXT';
    children: ReactNode;
};

const AnimatedFormContainer = ({ direction, children }: Props) => {
    const enteringAnimation = direction === 'BACK' ? SlideInLeft : SlideInRight;
    const exitingAnimation = direction === 'BACK' ? SlideOutRight : SlideOutLeft;

    return (
        <Animated.View
            entering={enteringAnimation}
            exiting={exitingAnimation}
            style={{ flex: 1, padding: 16 }}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedFormContainer;
