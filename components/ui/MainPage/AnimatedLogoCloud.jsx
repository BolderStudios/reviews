// Instructions for integrating continuous logo animation in Tailwind CSS:
// Add the following configurations to the `extend` section of your `tailwind.config.js`:
// 1. Keyframes for 'logo-cloud' animation that continuously moves logos from right to left:
//    keyframes: {
//      'logo-cloud': {
//        from: { transform: 'translateX(0)' },
//        to: { transform: 'translateX(calc(-100% - 4rem))' },
//      },
//    }
// 2. Animation utility to apply this keyframe:
//    animation: {
//      'logo-cloud': 'logo-cloud 30s linear infinite', // Adjust duration and timing as needed for your design.
//    }

const logos = [
    {
      name: 'Solita',
      url: 'https://res.cloudinary.com/drzscdhyn/image/upload/v1724800337/tsb3wr1vhbo6sgshmqyp.svg',
    },
    {
      name: 'Else',
      url: 'https://res.cloudinary.com/drzscdhyn/image/upload/v1724800346/kcor7d92ayz0c8ig7oxz.png',
    },
    {
      name: 'El torito',
      url: 'https://res.cloudinary.com/drzscdhyn/image/upload/v1724800492/ijglxm0axeftejigap5k.svg',
    },
    {
      name: 'Calmex',
      url: 'https://res.cloudinary.com/drzscdhyn/image/upload/v1724800755/bya3htzjrpakqcpy45tw.svg',
    },
    {
      name: 'Prince St. Pizza',
      url: 'https://res.cloudinary.com/drzscdhyn/image/upload/v1724800888/aaz1jxcqkjvyoxd7ae0p.webp',
    },
    {
      name: 'Katsuya',
      url: 'https://res.cloudinary.com/drzscdhyn/image/upload/v1724801051/izpg9nc3vhj3he9i2mht.svg',
    },
    {
      name: 'Tacos 1986',
      url: 'https://res.cloudinary.com/drzscdhyn/image/upload/v1724801107/rlruhmmi9sa0f2aursba.png',
    },
    {
      name: 'Tokyo Fried Chicken',
      url: 'https://res.cloudinary.com/drzscdhyn/image/upload/v1724801410/bvzjhzofcvgfowkbkozf.png',
    },
  ]
  
  const AnimatedLogoCloud = () => {
    return (
      <div className="w-full">
        <div className="mx-auto w-full px-4 md:px-8">
          <div
            className="group relative mt-7 flex gap-6 overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)',
            }}
          >
            {Array(5)
              .fill(null)
              .map((index) => (
                <div
                  key={index}
                  className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-6"
                >
                  {logos.map((logo, key) => (
                    <img
                      key={key}
                      src={logo.url}
                      className="h-10 w-28 px-2 brightness-0  dark:invert object-contain"
                      alt={`${logo.name}`}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default AnimatedLogoCloud
  