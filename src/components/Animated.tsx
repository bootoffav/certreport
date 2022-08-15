import { useSpring, animated } from '@react-spring/web';

const Animated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: true,
  });
  return <animated.div style={props}>{children}</animated.div>;
};

export default Animated;
