import Lottie from 'react-lottie';
import animationData from './loaderAnimation.json'

export const Loading = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: 'column',
            height: "100vh" // full screen height
        }}>
            <p>Loading your dogs</p>
            <Lottie options={defaultOptions}
                height={300}
                width={300}
            />
        </div>
    );
}